/**
 * 静态演示模式的数据层。
 *
 * 为什么需要它：后端（apps/server，Express + node:sqlite）要占本机进程、要读写
 * 数据库文件，静态托管跑不了。而演示站必须能脱离后端独立打开，所以这里用一份
 * 内存 fixture 实现了与后端完全相同的接口。
 *
 * 行为刻意对齐 apps/server，不是「能跑就行」：
 *   - state 按设备类型白名单合并，脏字段进不来（STATE_KEYS 与后端 model.ts 一致）
 *   - 场景列表按 createdAt 升序（后端是 ORDER BY created_at ASC）
 *   - 错误码与文案与后端一致（设备/场景 404、场景名空 400）
 *
 * 数据只存在于内存，**刷新页面即回到初始状态** —— 这是演示模式的预期行为，不是 bug。
 * 仅在 VITE_DEMO=true 时启用（判定见下方 isDemoMode，切换点在 http.ts）。
 */
import type { Scene } from '@/types/scene'
import { ApiError } from './apiError'

/** 演示模式开关。构建时由 VITE_DEMO 静态注入，见 vite-env.d.ts 与 .env.demo */
export const isDemoMode = import.meta.env.VITE_DEMO === 'true'

/** 各类型允许的 state 字段 —— 与 apps/server/src/model.ts 的 STATE_KEYS 保持一致 */
const STATE_KEYS: Record<string, string[]> = {
  light: ['brightness', 'colorTemp'],
  'air-conditioner': ['temperature'],
  fan: ['windLevel', 'mode', 'swingH', 'swingHAngle', 'swingV', 'swingVAngle', 'timerHours'],
}

/**
 * 内部按宽松形态存储，出口再断言成调用方要的类型 ——
 * 与后端 toDevice() 的做法一致（契约校验发生在调用方按 type 判别时）。
 */
interface DemoDevice {
  id: string
  name: string
  type: string
  room: string
  online: boolean
  power: boolean
  /** 仅 light / air-conditioner / fan 有专属状态，其余类型契约中无该字段 */
  state?: Record<string, unknown>
}

/** 与 apps/server/src/db.ts 的 seed() 一致（场景 id 改为固定值，便于演示时稳定复现） */
function initialDevices(): DemoDevice[] {
  return [
    {
      id: 'light-001',
      name: '客厅吸顶灯',
      type: 'light',
      room: '客厅',
      online: true,
      power: true,
      state: { brightness: 80, colorTemp: 4000 },
    },
    {
      id: 'light-002',
      name: '主卧床头灯',
      type: 'light',
      room: '主卧',
      online: true,
      power: false,
      state: { brightness: 30, colorTemp: 3000 },
    },
    {
      id: 'ac-001',
      name: '客厅空调',
      type: 'air-conditioner',
      room: '客厅',
      online: true,
      power: true,
      state: { temperature: 26 },
    },
    { id: 'curtain-001', name: '客厅窗帘', type: 'curtain', room: '客厅', online: true, power: false },
    { id: 'switch-001', name: '玄关插座', type: 'plug', room: '玄关', online: true, power: true },
    { id: 'sensor-001', name: '厨房烟雾传感器', type: 'sensor', room: '厨房', online: false, power: false },
    {
      id: 'fan-001',
      name: '小米桌面风扇',
      type: 'fan',
      room: '书房',
      online: true,
      power: true,
      state: {
        windLevel: 3,
        mode: 'natural',
        swingH: true,
        swingHAngle: 90,
        swingV: false,
        swingVAngle: 30,
        timerHours: 0,
      },
    },
  ]
}

function initialScenes(): Scene[] {
  return [
    {
      id: 'scene-001',
      name: '回家模式',
      description: '开灯、开空调、关窗帘',
      enabled: true,
      createdAt: '2026-08-25T10:00:00.000Z',
    },
    {
      id: 'scene-002',
      name: '睡眠模式',
      description: '关灯、关窗帘、风扇自然风',
      enabled: true,
      createdAt: '2026-08-25T10:01:00.000Z',
    },
    {
      id: 'scene-003',
      name: '离家模式',
      description: '全屋关灯、关空调、关风扇',
      enabled: true,
      createdAt: '2026-08-25T10:02:00.000Z',
    },
    {
      id: 'scene-004',
      name: '观影模式',
      description: '关灯、调暗灯光、开启风扇',
      enabled: false,
      createdAt: '2026-08-25T10:03:00.000Z',
    },
  ]
}

let devices = initialDevices()
let scenes = initialScenes()
let sceneSeq = scenes.length

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

/** 出口断言：内存里的宽松形态当作接口响应交给调用方（与 JSON.parse 的信任边界相同） */
const asResponse = <T>(value: unknown): T => value as T

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** 模拟一次网络往返：演示站瞬时返回反而看不出真实的加载态 */
const LATENCY_MS = 120

/** 从 '/devices/light-001' 这类路径取出 id，取不到返回 null */
function matchId(path: string, prefix: string): string | null {
  if (!path.startsWith(prefix)) return null
  const id = path.slice(prefix.length)
  return id && !id.includes('/') ? id : null
}

/**
 * 与 http.request 同签名、同返回语义的内存实现。
 * 未覆盖的接口直接抛 404，避免演示站静默假装成功。
 */
export async function demoRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  await sleep(LATENCY_MS)

  const method = (options.method ?? 'GET').toUpperCase()
  const body = (options.body ? JSON.parse(String(options.body)) : {}) as Record<string, unknown>

  // ---- 设备 ----
  if (path === '/devices' && method === 'GET') {
    return asResponse<T>(clone(devices))
  }

  const deviceId = matchId(path, '/devices/')
  if (deviceId && method === 'PATCH') {
    const device = devices.find((d) => d.id === deviceId)
    if (!device) throw new ApiError(404, '设备不存在')

    // 公共字段平铺
    if (typeof body.name === 'string') device.name = body.name
    if (typeof body.room === 'string') device.room = body.room
    if (typeof body.online === 'boolean') device.online = body.online
    if (typeof body.power === 'boolean') device.power = body.power

    // 类型专属字段按白名单合并
    const statePatch = body.state
    if (statePatch && typeof statePatch === 'object') {
      const allowed = STATE_KEYS[device.type] ?? []
      const merged = { ...device.state }
      for (const [key, value] of Object.entries(statePatch as Record<string, unknown>)) {
        if (allowed.includes(key)) merged[key] = value
      }
      device.state = merged
    }

    return asResponse<T>(clone(device))
  }

  // ---- 场景 ----
  if (path === '/scenes' && method === 'GET') {
    const sorted = [...scenes].sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
    return asResponse<T>(clone(sorted))
  }

  if (path === '/scenes' && method === 'POST') {
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!name) throw new ApiError(400, '场景名称不能为空')

    const scene: Scene = {
      id: `scene-${String(++sceneSeq).padStart(3, '0')}`,
      name,
      enabled: true,
      createdAt: new Date().toISOString(),
    }
    if (typeof body.description === 'string' && body.description) scene.description = body.description

    scenes.push(scene)
    return asResponse<T>(clone(scene))
  }

  const sceneId = matchId(path, '/scenes/')

  if (sceneId && method === 'DELETE') {
    const index = scenes.findIndex((s) => s.id === sceneId)
    if (index === -1) throw new ApiError(404, '场景不存在')
    scenes.splice(index, 1)
    return asResponse<T>(undefined)
  }

  if (sceneId && method === 'PATCH') {
    const scene = scenes.find((s) => s.id === sceneId)
    if (!scene) throw new ApiError(404, '场景不存在')

    if (typeof body.name === 'string') {
      const name = body.name.trim()
      if (!name) throw new ApiError(400, '场景名称不能为空')
      scene.name = name
    }
    if (typeof body.description === 'string') scene.description = body.description
    if (typeof body.enabled === 'boolean') scene.enabled = body.enabled

    return asResponse<T>(clone(scene))
  }

  throw new ApiError(404, `演示模式未实现该接口：${method} ${path}`)
}

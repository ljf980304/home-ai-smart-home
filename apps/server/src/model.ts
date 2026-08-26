/**
 * 数据模型：对齐 `docs/api/接口清单.md` 的设备判别联合 + 场景结构。
 * DB 行与对外 JSON 之间做转换，保证输出与前端契约一致。
 */

/** devices 表行（state 以 JSON 文本存储） */
export interface DeviceRow {
  id: string
  name: string
  type: string
  room: string
  /** 0/1 存储，对外输出 boolean */
  online: number
  power: number
  state: string
}

/** 对外输出的设备（判别联合形态；switch/curtain/sensor/plug 无 state） */
export interface Device {
  id: string
  name: string
  type: string
  room: string
  online: boolean
  power: boolean
  state?: Record<string, unknown>
}

/** 场景 */
export interface Scene {
  id: string
  name: string
  description?: string
  enabled: boolean
  createdAt?: string
}

/** 各类型允许的 state 字段（契约内字段，PATCH 时按此白名单过滤） */
export const STATE_KEYS: Record<string, string[]> = {
  light: ['brightness', 'colorTemp'],
  'air-conditioner': ['temperature'],
  fan: ['windLevel', 'mode', 'swingH', 'swingHAngle', 'swingV', 'swingVAngle', 'timerHours'],
}

/** 行 → 对外 Device */
export function toDevice(row: DeviceRow): Device {
  const base: Device = {
    id: row.id,
    name: row.name,
    type: row.type,
    room: row.room,
    online: row.online === 1,
    power: row.power === 1,
  }
  // 仅带专属 state 的类型输出 state（其余类型契约中无该字段）
  if (STATE_KEYS[row.type]) {
    base.state = parseState(row.state)
  }
  return base
}

/** 解析 state JSON，异常时回退为空对象 */
export function parseState(text: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(text || '{}')
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

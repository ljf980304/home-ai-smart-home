import { Router } from 'express'
import { db } from '../db.js'
import { STATE_KEYS, toDevice, type Device, type DeviceRow } from '../model.js'

export const devicesRouter = Router()

function getRow(id: string): DeviceRow | undefined {
  return db.prepare('SELECT * FROM devices WHERE id = ?').get(id) as DeviceRow | undefined
}

/** GET /devices — 设备列表 */
devicesRouter.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM devices').all() as unknown as DeviceRow[]
  const devices: Device[] = rows.map(toDevice)
  res.json(devices)
})

/**
 * PATCH /devices/:id — 设备控制。
 * 公共字段（name/room/online/power）直接平铺；类型专属字段放 state 内，
 * 按类型白名单过滤后合并。响应为更新后的完整设备。
 */
devicesRouter.patch('/:id', (req, res) => {
  const row = getRow(req.params.id)
  if (!row) {
    res.status(404).json({ message: '设备不存在' })
    return
  }

  const body = (req.body ?? {}) as Record<string, unknown>
  const assigns: string[] = []
  const values: (string | number)[] = []

  if (typeof body.name === 'string') {
    assigns.push('name = ?')
    values.push(body.name)
  }
  if (typeof body.room === 'string') {
    assigns.push('room = ?')
    values.push(body.room)
  }
  if (typeof body.online === 'boolean') {
    assigns.push('online = ?')
    values.push(body.online ? 1 : 0)
  }
  if (typeof body.power === 'boolean') {
    assigns.push('power = ?')
    values.push(body.power ? 1 : 0)
  }

  const statePatch = body.state
  if (statePatch && typeof statePatch === 'object') {
    const allowed = STATE_KEYS[row.type] ?? []
    const merged = { ...parseStateSafe(row.state) }
    for (const [k, v] of Object.entries(statePatch)) {
      if (allowed.includes(k)) merged[k] = v
    }
    assigns.push('state = ?')
    values.push(JSON.stringify(merged))
  }

  if (assigns.length > 0) {
    values.push(row.id)
    db.prepare(`UPDATE devices SET ${assigns.join(', ')} WHERE id = ?`).run(...values)
  }

  res.json(toDevice(getRow(row.id)!))
})

function parseStateSafe(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text || '{}') as Record<string, unknown>
  } catch {
    return {}
  }
}

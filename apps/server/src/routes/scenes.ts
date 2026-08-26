import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { db } from '../db.js'
import type { Scene } from '../model.js'

export const scenesRouter = Router()

interface SceneRow {
  id: string
  name: string
  description: string
  enabled: number
  created_at: string
}

function toScene(row: SceneRow): Scene {
  const scene: Scene = {
    id: row.id,
    name: row.name,
    enabled: row.enabled === 1,
  }
  if (row.description) scene.description = row.description
  scene.createdAt = row.created_at
  return scene
}

function getRow(id: string): SceneRow | undefined {
  return db.prepare('SELECT * FROM scenes WHERE id = ?').get(id) as SceneRow | undefined
}

/** GET /scenes — 场景列表 */
scenesRouter.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM scenes ORDER BY created_at ASC').all() as unknown as SceneRow[]
  res.json(rows.map(toScene))
})

/** POST /scenes — 创建场景 */
scenesRouter.post('/', (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) {
    res.status(400).json({ message: '场景名称不能为空' })
    return
  }
  const description = typeof body.description === 'string' ? body.description : ''
  const id = randomUUID()
  const createdAt = new Date().toISOString()

  db.prepare(
    'INSERT INTO scenes (id, name, description, enabled, created_at) VALUES (?, ?, ?, ?, ?)',
  ).run(id, name, description, 1, createdAt)

  res.status(201).json(toScene(getRow(id)!))
})

/** DELETE /scenes/:id — 删除场景 */
scenesRouter.delete('/:id', (req, res) => {
  const row = getRow(req.params.id)
  if (!row) {
    res.status(404).json({ message: '场景不存在' })
    return
  }
  db.prepare('DELETE FROM scenes WHERE id = ?').run(row.id)
  res.status(204).end()
})

/** PATCH /scenes/:id — 更新场景（name/description/enabled） */
scenesRouter.patch('/:id', (req, res) => {
  const row = getRow(req.params.id)
  if (!row) {
    res.status(404).json({ message: '场景不存在' })
    return
  }

  const body = (req.body ?? {}) as Record<string, unknown>
  const assigns: string[] = []
  const values: (string | number)[] = []

  if (typeof body.name === 'string') {
    const name = body.name.trim()
    if (!name) {
      res.status(400).json({ message: '场景名称不能为空' })
      return
    }
    assigns.push('name = ?')
    values.push(name)
  }
  if (typeof body.description === 'string') {
    assigns.push('description = ?')
    values.push(body.description)
  }
  if (typeof body.enabled === 'boolean') {
    assigns.push('enabled = ?')
    values.push(body.enabled ? 1 : 0)
  }

  if (assigns.length > 0) {
    values.push(row.id)
    db.prepare(`UPDATE scenes SET ${assigns.join(', ')} WHERE id = ?`).run(...values)
  }

  res.json(toScene(getRow(row.id)!))
})

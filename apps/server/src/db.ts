import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import { randomUUID } from 'node:crypto'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = join(here, '..', 'data')
mkdirSync(dataDir, { recursive: true })

export const db = new DatabaseSync(join(dataDir, 'home-ai.sqlite'))

/** 建表（幂等） */
function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS devices (
      id     TEXT PRIMARY KEY,
      name   TEXT NOT NULL,
      type   TEXT NOT NULL,
      room   TEXT NOT NULL,
      online INTEGER NOT NULL DEFAULT 1,
      power  INTEGER NOT NULL DEFAULT 0,
      state  TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS scenes (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      enabled     INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT NOT NULL
    );
  `)
}

/** 首启种子数据（仅当 devices 为空时灌入，避免覆盖已有数据） */
function seed() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM devices').get() as { c: number }
  if (count.c > 0) return

  const insert = db.prepare(
    'INSERT INTO devices (id, name, type, room, online, power, state) VALUES (?, ?, ?, ?, ?, ?, ?)',
  )
  const rows: [string, string, string, string, number, number, string][] = [
    ['light-001', '客厅吸顶灯', 'light', '客厅', 1, 1, '{"brightness":80,"colorTemp":4000}'],
    ['light-002', '主卧床头灯', 'light', '主卧', 1, 0, '{"brightness":30,"colorTemp":3000}'],
    ['ac-001', '客厅空调', 'air-conditioner', '客厅', 1, 1, '{"temperature":26}'],
    ['curtain-001', '客厅窗帘', 'curtain', '客厅', 1, 0, '{}'],
    ['switch-001', '玄关插座', 'plug', '玄关', 1, 1, '{}'],
    ['sensor-001', '厨房烟雾传感器', 'sensor', '厨房', 0, 0, '{}'],
    ['fan-001', '小米桌面风扇', 'fan', '书房', 1, 1, '{"windLevel":3,"mode":"natural","swingH":true,"swingHAngle":90,"swingV":false,"swingVAngle":30,"timerHours":0}'],
  ]
  for (const r of rows) insert.run(...r)

  const insertScene = db.prepare(
    'INSERT INTO scenes (id, name, description, enabled, created_at) VALUES (?, ?, ?, ?, ?)',
  )
  const scenes: [string, string, string, number, string][] = [
    [randomUUID(), '回家模式', '开灯、开空调、关窗帘', 1, new Date().toISOString()],
    [randomUUID(), '睡眠模式', '关灯、关窗帘、风扇自然风', 1, new Date().toISOString()],
    [randomUUID(), '离家模式', '全屋关灯、关空调、关风扇', 1, new Date().toISOString()],
    [randomUUID(), '观影模式', '关灯、调暗灯光、开启风扇', 0, new Date().toISOString()],
  ]
  for (const s of scenes) insertScene.run(...s)
}

export function initDb() {
  createSchema()
  seed()
}

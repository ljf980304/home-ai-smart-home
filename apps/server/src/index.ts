import express from 'express'
import { initDb } from './db.js'
import { devicesRouter } from './routes/devices.js'
import { scenesRouter } from './routes/scenes.js'

const app = express()
app.use(express.json())

// 启动即建表 + 灌入种子数据（幂等）
initDb()

// 与 `docs/api/接口清单.md` 一致，路径不含 /api 前缀（前端由 vite proxy 加上）
app.use('/devices', devicesRouter)
app.use('/scenes', scenesRouter)

const port = Number(process.env.PORT) || 3001
app.listen(port, () => {
  console.log(`[home-ai server] listening on http://127.0.0.1:${port}`)
})

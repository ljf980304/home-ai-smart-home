# 🏠 Home AI Smart Home

**万枢 · 全屋 AI 智能体** 的第一期地基，个人开发项目（单仓库 monorepo）。

万枢要做的是一个**中立第三方**的全屋智能体：不绑定任何一家厂商的生态，把不同品牌的设备统一接进来；语音、设备记录、使用习惯全部存在本地主机里，不上传云端。

> 本仓库目前落地的只是**设备控制基座**这一层 —— 本地后端 + 可视化控制面板。产品规划里的 AI 语音能力层（离线唤醒 / 多方言识别 / 端侧大模型）和扩展能力层（内网穿透 / 静默升级）**尚未开始**，进度见下方「开发状态」。

## 项目结构

```
home-ai-smart-home/
├── apps/
│   ├── dashboard/        # 智能家居控制面板（Vue 3 前端）
│   │   ├── src/          # 源码
│   │   ├── public/       # 静态资源
│   │   └── vite.config.ts
│   └── server/           # 本地后端（Express + SQLite，node:sqlite）
│       ├── src/          # 源码（db / routes / model）
│       └── data/         # SQLite 数据文件（运行时生成，已 gitignore）
└── packages/             # 共享包（类型、工具函数、API 层，规划中）
```

采用 **pnpm workspace** 管理，`apps/*` 放应用，`packages/*` 放共享包。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3（`<script setup>`）+ TypeScript |
| 路由 | Vue Router 4 |
| UI | Naive UI |
| 状态管理 | Pinia |
| 构建 | Vite 8 |
| 后端 | Express 5 + TypeScript |
| 数据库 | SQLite（Node 内置 `node:sqlite`，无原生依赖） |
| 包管理 | pnpm（workspace monorepo） |
| 代码检查 | ESLint 10（flat config） |

## 数据与接口

- 前端请求统一走 `/api` 前缀，由 vite proxy 转发到本地后端（`apps/server`，Express + SQLite）
- 接口契约见 [docs/api/接口清单.md](docs/api/接口清单.md)，前后端以此为准（后端已按契约实现，前端组件零改动可切换）
- 后端地址默认 `http://127.0.0.1:3001`，可用环境变量覆盖：`VITE_API_PROXY_TARGET=http://localhost:3001 pnpm -F dashboard dev`
- SQLite 数据文件生成于 `apps/server/data/`（首次启动自动建库 + 种子数据），已 gitignore；删除该文件即重置数据

## 快速开始

> **环境要求：Node ≥ 22.5（推荐 24 LTS）** —— 后端使用 Node 内置的 `node:sqlite`（22.5+ 引入），版本过低会启动失败。安装依赖时 pnpm 也会按根目录 `engines` 校验版本。

```bash
# 1. 安装依赖（在仓库根目录）
pnpm install

# 2. 启动全部应用（后端 + dashboard）
pnpm dev
# 或分别启动：
#   pnpm dev:server   # 仅后端（http://127.0.0.1:3001）
#   pnpm dev:web      # 仅前端（http://localhost:5173）
```

浏览器访问终端输出的本地地址（默认 http://localhost:5173）。

其他常用命令（均在根目录执行）：

```bash
pnpm build        # 构建全部应用
pnpm typecheck    # 全仓库 TypeScript 类型检查
pnpm lint         # 全仓库 ESLint 检查
```

## 开发状态

- [x] monorepo 脚手架初始化
- [x] dashboard 页面骨架（路由、布局、占位视图）
- [x] 前端业务骨架（设备管理 / 总览 / 场景管理）
- [x] 本地后端（Express + SQLite，按契约实现设备 / 场景接口，替换 APIfox mock）
- [ ] 设备接入适配层（米家 / 华为智联 / Aqara 等生态的局域网协议，叠加 Matter 通用协议）
- [ ] AI 语音能力层（离线唤醒 + 多方言离线识别 + 端侧大模型指令解析）
- [ ] 适老化 UI、本地多端同步
- [ ] packages 共享包拆分

## 许可证

ISC

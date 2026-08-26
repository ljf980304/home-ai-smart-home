# 🏠 Home AI Smart Home

家庭 AI 智能家居 —— 个人开发项目（单仓库 monorepo）。

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
- [ ] 智能家居设备接入（米家 / 华为 / Matter 硬件适配层）
- [ ] AI 对话 / 场景控制能力
- [ ] packages 共享包拆分

## 许可证

ISC

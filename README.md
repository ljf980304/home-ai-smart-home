# 🏠 Home AI Smart Home

家庭 AI 智能家居 —— 个人开发项目（单仓库 monorepo）。

## 项目结构

```
home-ai-smart-home/
├── apps/
│   └── dashboard/        # 智能家居控制面板（Vue 3 前端）
│       ├── src/          # 源码
│       ├── public/       # 静态资源
│       └── vite.config.ts
└── packages/             # 共享包（类型、工具函数、API 层，规划中）
```

采用 **pnpm workspace** 管理，`apps/*` 放应用，`packages/*` 放共享包。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3（`<script setup>`）+ TypeScript |
| 构建 | Vite 8 |
| 包管理 | pnpm（workspace monorepo） |

## 快速开始

```bash
# 1. 安装依赖（在仓库根目录）
pnpm install

# 2. 启动 dashboard 开发服务器
pnpm --dir apps/dashboard dev
# 或
cd apps/dashboard && pnpm dev
```

浏览器访问终端输出的本地地址（默认 http://localhost:5173）。

## 开发状态

- [x] monorepo 脚手架初始化
- [ ] dashboard 页面骨架（路由、布局）
- [ ] 智能家居设备接入（灯光、温控、安防等）
- [ ] AI 对话/场景控制能力
- [ ] packages 共享包拆分

## 许可证

ISC

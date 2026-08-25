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
| 路由 | Vue Router 4 |
| 构建 | Vite 8 |
| 包管理 | pnpm（workspace monorepo） |
| 代码检查 | ESLint 10（flat config） |

## 快速开始

```bash
# 1. 安装依赖（在仓库根目录）
pnpm install

# 2. 启动 dashboard 开发服务器
pnpm -F dashboard dev
```

浏览器访问终端输出的本地地址（默认 http://localhost:5173）。

> 根目录也配置了 `pnpm dev`（递归启动全部应用），单应用时效果等同，可按习惯任选。

其他常用命令（均在根目录执行）：

```bash
pnpm build        # 构建全部应用
pnpm typecheck    # 全仓库 TypeScript 类型检查
pnpm lint         # 全仓库 ESLint 检查
```

## 开发状态

- [x] monorepo 脚手架初始化
- [x] dashboard 页面骨架（路由、布局、占位视图）
- [ ] 智能家居设备接入（灯光、温控、安防等）
- [ ] AI 对话/场景控制能力
- [ ] packages 共享包拆分

## 许可证

ISC

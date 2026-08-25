# dashboard —— 智能家居控制面板

Vue 3 + TypeScript + Vite 构建的家庭智能家居前端控制面板。

## 技术栈

- Vue 3（`<script setup>`）+ TypeScript
- Vue Router 4（页面路由）
- Vite 8 + vue-tsc（构建 / 类型检查）
- ESLint 10（flat config，仓库根目录统一配置）

## 常用命令

```bash
pnpm -F dashboard dev          # 启动开发服务器（默认 http://localhost:5173）
pnpm -F dashboard build        # 生产构建
pnpm -F dashboard preview      # 预览构建产物
pnpm -F dashboard typecheck    # 类型检查
```

代码检查统一在仓库根目录执行：`pnpm lint`。

## 目录结构

```
src/
├── router/          # 路由配置（总览 / 设备 / 场景 / 设置）
├── layouts/         # 布局组件（DefaultLayout：侧边栏 + 顶栏 + 内容区）
├── views/           # 页面视图（HomeView、DevicesView、ScenesView、SettingsView）
├── App.vue          # 根组件（仅承载 RouterView）
├── main.ts          # 应用入口，挂载 router
└── style.css        # 全局样式与 CSS 变量（支持深色模式）
```

> 路径别名 `@` 指向 `src/`，vite.config 与 tsconfig 已同步配置。

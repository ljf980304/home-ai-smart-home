# dashboard —— 智能家居控制面板

Vue 3 + TypeScript + Vite 构建的家庭智能家居前端控制面板。

## 技术栈

- Vue 3（`<script setup>`）+ TypeScript
- Vue Router 4（页面路由）
- Naive UI（组件库）
- Pinia（状态管理，设备 / 场景跨页共享）
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

## 数据层

前端请求统一走 `/api` 前缀，vite proxy 转发到接口服务：

- **当前**：APIfox mock（接口契约见 [docs/api/接口清单.md](../../docs/api/接口清单.md)），mock 地址默认 `http://127.0.0.1:4523`，可用 `VITE_API_PROXY_TARGET` 覆盖
- **后续**：Express + SQLite 后端，按同一份契约实现；届时 proxy 指向后端即可，组件零改动

数据流向：组件 → Pinia store → service（fetch）→ `/api` proxy → 接口服务。
设备控制采用**乐观更新**（开关/滑块先本地生效，失败回滚），不依赖 mock 写回数据。

## 目录结构

```
src/
├── router/          # 路由配置（总览 / 设备 / 场景 / 设置）
├── layouts/         # 布局组件（DefaultLayout：侧边栏 + 顶栏 + 内容区）
├── views/           # 页面视图（HomeView、DevicesView、ScenesView、SettingsView）
├── types/           # 数据模型（device / scene）
├── services/        # 接口层（http 封装 + device/scene service）
├── stores/          # Pinia store（deviceStore / sceneStore）
├── App.vue          # 根组件（Naive UI Provider + RouterView）
├── main.ts          # 应用入口，挂载 router / pinia
└── style.css        # 全局样式与 CSS 变量（支持深色模式）
```

> 路径别名 `@` 指向 `src/`，vite.config 与 tsconfig 已同步配置。

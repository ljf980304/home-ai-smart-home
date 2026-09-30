/**
 * Vite 环境变量声明。
 * `vite/client` 已提供 ImportMetaEnv 的索引签名，这里补上本项目的具体键名。
 */
interface ImportMetaEnv {
  /** 'true' 时启用静态演示模式：走内存 fixture、不连后端。见 services/demo.ts */
  readonly VITE_DEMO?: string
  /** dev 环境下 /api 的代理目标。见 vite.config.ts */
  readonly VITE_API_PROXY_TARGET?: string
}

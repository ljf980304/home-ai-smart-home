/**
 * 接口错误。
 *
 * 单独成文件是为了让 http 层与演示数据层（services/demo.ts）都能引用，
 * 而不会构成 http ⇄ demo 的循环依赖。
 */
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

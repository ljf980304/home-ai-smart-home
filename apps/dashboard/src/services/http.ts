import { ApiError } from './apiError'
import { demoRequest, isDemoMode } from './demo'

export { ApiError }

const BASE_URL = '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // 演示模式：不连后端，改走内存 fixture（见 demo.ts）
  if (isDemoMode) return demoRequest<T>(path, options)

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    // 网络层失败（如后端未启动）
    throw new ApiError(0, '网络异常，请确认接口服务已启动')
  }

  if (!res.ok) {
    throw new ApiError(res.status, `请求失败（${res.status} ${res.statusText}）`)
  }

  // 兼容空响应体（如 DELETE 返回 204、PATCH 无 body）
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

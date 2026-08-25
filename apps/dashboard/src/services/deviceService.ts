import { http } from './http'
import type { Device, FanState } from '@/types/device'

export function getDevices() {
  return http.get<Device[]>('/devices')
}

export function updateDevice(id: string, patch: Record<string, unknown>) {
  return http.patch<Device>(`/devices/${id}`, patch)
}

export function setDevicePower(id: string, power: boolean) {
  return updateDevice(id, { power })
}

/** 灯光：亮度 / 色温（走 state 对象） */
export function setBrightness(id: string, brightness: number) {
  return updateDevice(id, { state: { brightness } })
}

export function setColorTemp(id: string, colorTemp: number) {
  return updateDevice(id, { state: { colorTemp } })
}

/** 空调：温度 */
export function setTemperature(id: string, temperature: number) {
  return updateDevice(id, { state: { temperature } })
}

/** 风扇：状态字段更新（挡位 / 模式 / 摇头 / 定时） */
export function setFanState(id: string, patch: Partial<FanState>) {
  return updateDevice(id, { state: patch })
}

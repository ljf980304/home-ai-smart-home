import { http } from './http'
import type { Device } from '@/types/device'

export function getDevices() {
  return http.get<Device[]>('/devices')
}

export function updateDevice(id: string, patch: Partial<Device>) {
  return http.patch<Device>(`/devices/${id}`, patch)
}

export function setDevicePower(id: string, power: boolean) {
  return updateDevice(id, { power })
}

export function setBrightness(id: string, brightness: number) {
  return updateDevice(id, { brightness })
}

export function setColorTemp(id: string, colorTemp: number) {
  return updateDevice(id, { colorTemp })
}

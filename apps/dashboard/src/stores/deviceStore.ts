import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as deviceService from '@/services/deviceService'
import type { Device, DeviceType } from '@/types/device'

export const useDeviceStore = defineStore('device', () => {
  const devices = ref<Device[]>([])
  const loading = ref(false)
  const error = ref('')

  const totalCount = computed(() => devices.value.length)
  const onlineCount = computed(() => devices.value.filter((d) => d.online).length)

  /** 按房间分组的设备 */
  const byRoom = computed(() => {
    const map = new Map<string, Device[]>()
    for (const d of devices.value) {
      const list = map.get(d.room) ?? []
      list.push(d)
      map.set(d.room, list)
    }
    return map
  })

  /** 按类型分组的设备 */
  const byType = computed(() => {
    const map = new Map<DeviceType, Device[]>()
    for (const d of devices.value) {
      const list = map.get(d.type) ?? []
      list.push(d)
      map.set(d.type, list)
    }
    return map
  })

  async function fetchDevices() {
    loading.value = true
    error.value = ''
    try {
      devices.value = await deviceService.getDevices()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载设备失败'
    } finally {
      loading.value = false
    }
  }

  /**
   * 电源开关（乐观更新：先生效，失败回滚）。
   * 仅作用于在线设备。
   */
  async function togglePower(id: string) {
    const device = devices.value.find((d) => d.id === id)
    if (!device || !device.online) return
    const target = !device.power
    device.power = target
    try {
      await deviceService.setDevicePower(id, target)
    } catch (e) {
      device.power = !target
      error.value = e instanceof Error ? e.message : '控制失败'
    }
  }

  /**
   * 亮度持久化。滑块拖拽时组件已通过 v-model 本地更新，
   * 这里仅在拖拽结束（@change）时同步到接口。
   */
  async function setBrightness(id: string, value: number) {
    try {
      await deviceService.setBrightness(id, value)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '设置亮度失败'
    }
  }

  /** 色温持久化，同 setBrightness。 */
  async function setColorTemp(id: string, value: number) {
    try {
      await deviceService.setColorTemp(id, value)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '设置色温失败'
    }
  }

  return {
    devices,
    loading,
    error,
    totalCount,
    onlineCount,
    byRoom,
    byType,
    fetchDevices,
    togglePower,
    setBrightness,
    setColorTemp,
  }
})

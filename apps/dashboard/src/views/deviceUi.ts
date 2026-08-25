import { useDeviceStore } from '@/stores/deviceStore'
import type {
  AirConditionerState,
  Device,
  DeviceType,
  FanState,
  LightState,
} from '@/types/device'

/** 设备类型 → 标签颜色 */
export const TAG_TYPE: Partial<
  Record<DeviceType, 'default' | 'info' | 'success' | 'warning' | 'error'>
> = {
  light: 'warning',
  switch: 'info',
  'air-conditioner': 'success',
  curtain: 'default',
  sensor: 'info',
  plug: 'default',
  fan: 'info',
}

/** 控制项选项 */
export const WIND_LEVELS = [1, 2, 3, 4].map((v) => ({ label: `${v} 档`, value: v }))
export const SWING_H_ANGLES = [30, 60, 90, 120].map((v) => ({ label: `${v}°`, value: v }))
export const SWING_V_ANGLES = [30, 60, 90, 100].map((v) => ({ label: `${v}°`, value: v }))
export const TIMER_OPTIONS = [
  { label: '关闭', value: 0 },
  { label: '1h', value: 1 },
  { label: '2h', value: 2 },
  { label: '3h', value: 3 },
  { label: '4h', value: 4 },
]
export const MODE_OPTIONS = [
  { label: '直吹风', value: 'direct' },
  { label: '自然风', value: 'natural' },
]

/** 单个控制项定义 */
export type ControlSpec = {
  /** 对应 device.state 的字段；'power' 表示基础电源开关 */
  key: string
  label: string
  kind: 'switch' | 'radio' | 'slider'
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
  step?: number
}

const POWER_CONTROL: ControlSpec = { key: 'power', label: '电源', kind: 'switch' }

/**
 * 各设备类型的控制项清单（顺序即显示顺序）。
 * 卡片默认显示前 4 个；总数超过 4 个时显示「···」打开完整控制弹窗。
 */
export const DEVICE_CONTROLS: Record<DeviceType, ControlSpec[]> = {
  light: [
    POWER_CONTROL,
    { key: 'brightness', label: '亮度', kind: 'slider', min: 0, max: 100, step: 1 },
    { key: 'colorTemp', label: '色温', kind: 'slider', min: 2700, max: 6500, step: 100 },
  ],
  'air-conditioner': [
    POWER_CONTROL,
    { key: 'temperature', label: '温度', kind: 'slider', min: 16, max: 30, step: 1 },
  ],
  fan: [
    POWER_CONTROL,
    { key: 'windLevel', label: '挡位', kind: 'radio', options: WIND_LEVELS },
    { key: 'mode', label: '模式', kind: 'radio', options: MODE_OPTIONS },
    { key: 'timerHours', label: '定时', kind: 'radio', options: TIMER_OPTIONS },
    { key: 'swingH', label: '左右摇头', kind: 'switch' },
    { key: 'swingHAngle', label: '左右摇头角度', kind: 'radio', options: SWING_H_ANGLES },
    { key: 'swingV', label: '上下摇头', kind: 'switch' },
    { key: 'swingVAngle', label: '上下摇头角度', kind: 'radio', options: SWING_V_ANGLES },
  ],
  switch: [POWER_CONTROL],
  curtain: [POWER_CONTROL],
  plug: [POWER_CONTROL],
  sensor: [],
}

/** 读取设备某控制项的当前值 */
export function controlValue(device: Device, c: ControlSpec): string | number | boolean {
  if (c.key === 'power') return device.power
  switch (device.type) {
    case 'light':
      return device.state[c.key as keyof LightState]
    case 'air-conditioner':
      return device.state[c.key as keyof AirConditionerState]
    case 'fan':
      return device.state[c.key as keyof FanState]
    default:
      return false
  }
}

/** 滑块专用取值（滑块 value 只接受 number） */
export function sliderValue(device: Device, c: ControlSpec): number {
  const v = controlValue(device, c)
  return typeof v === 'number' ? v : 0
}

/** 应用某控制项的新值（开关 / 单选 / 滑块结束），乐观更新 */
export function applyControl(device: Device, c: ControlSpec, value: string | number | boolean) {
  const store = useDeviceStore()
  if (c.key === 'power') {
    void store.togglePower(device.id)
    return
  }
  if (device.type === 'fan') {
    void store.updateFanState(device.id, { [c.key]: value } as Partial<FanState>)
  } else if (device.type === 'light') {
    if (c.key === 'brightness') void store.setBrightness(device.id, value as number)
    else if (c.key === 'colorTemp') void store.setColorTemp(device.id, value as number)
  } else if (device.type === 'air-conditioner' && c.key === 'temperature') {
    void store.setTemperature(device.id, value as number)
  }
}

/** 滑块拖拽中的本地更新（乐观显示），结束后由 applyControl 持久化 */
export function applySlider(device: Device, c: ControlSpec, value: number | number[]) {
  const v = Array.isArray(value) ? (value[0] ?? 0) : value
  if (device.type === 'light') {
    if (c.key === 'brightness') device.state.brightness = v
    else if (c.key === 'colorTemp') device.state.colorTemp = v
  } else if (device.type === 'air-conditioner' && c.key === 'temperature') {
    device.state.temperature = v
  }
}

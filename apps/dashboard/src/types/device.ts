/** 设备类型 */
export type DeviceType =
  | 'light' // 灯光
  | 'switch' // 开关 / 插座
  | 'air-conditioner' // 空调
  | 'curtain' // 窗帘
  | 'sensor' // 传感器（温湿度 / 人体 / 门磁）
  | 'plug' // 智能插座

/** 设备类型中文标签 */
export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  light: '灯光',
  switch: '开关',
  'air-conditioner': '空调',
  curtain: '窗帘',
  sensor: '传感器',
  plug: '智能插座',
}

/** 家庭设备 */
export interface Device {
  id: string
  name: string
  type: DeviceType
  /** 所属房间 */
  room: string
  online: boolean
  power: boolean
  /** 亮度 0-100（灯光） */
  brightness?: number
  /** 色温 2700-6500K（灯光） */
  colorTemp?: number
  /** 温度设置 ℃（空调 / 温控） */
  temperature?: number
}

/** 房间 */
export type Room = string

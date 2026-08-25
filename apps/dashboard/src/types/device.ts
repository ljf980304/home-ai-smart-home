/** 设备类型 */
export type DeviceType =
  | 'light' // 灯光
  | 'switch' // 开关 / 插座
  | 'air-conditioner' // 空调
  | 'curtain' // 窗帘
  | 'sensor' // 传感器（温湿度 / 人体 / 门磁）
  | 'plug' // 智能插座
  | 'fan' // 风扇

/** 设备类型中文标签 */
export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  light: '灯光',
  switch: '开关',
  'air-conditioner': '空调',
  curtain: '窗帘',
  sensor: '传感器',
  plug: '智能插座',
  fan: '风扇',
}

/** 所有设备共有的属性 */
interface DeviceBase {
  id: string
  name: string
  /** 所属房间 */
  room: string
  online: boolean
  power: boolean
}

/** 灯光状态 */
export interface LightState {
  /** 亮度 0-100 */
  brightness: number
  /** 色温 2700-6500 K */
  colorTemp: number
}

/** 空调状态 */
export interface AirConditionerState {
  /** 温度设置 ℃ */
  temperature: number
}

/** 风扇状态 */
export interface FanState {
  /** 风量挡位 1-4 */
  windLevel: 1 | 2 | 3 | 4
  /** 送风模式：直吹 / 自然风 */
  mode: 'direct' | 'natural'
  /** 左右摇头开关 */
  swingH: boolean
  /** 左右摇头角度（度） */
  swingHAngle: 30 | 60 | 90 | 120
  /** 上下摇头开关 */
  swingV: boolean
  /** 上下摇头角度（度） */
  swingVAngle: 30 | 60 | 90 | 100
  /** 定时待机（小时，0 = 关闭） */
  timerHours: 0 | 1 | 2 | 3 | 4
}

/**
 * 家庭设备（按类型判别）。
 * `type` 决定 `state` 的具体形态；switch/curtain/sensor/plug 暂无专属状态。
 */
export type Device =
  | (DeviceBase & { type: 'light'; state: LightState })
  | (DeviceBase & { type: 'air-conditioner'; state: AirConditionerState })
  | (DeviceBase & { type: 'fan'; state: FanState })
  | (DeviceBase & { type: 'switch' | 'curtain' | 'sensor' | 'plug' })

/** 房间 */
export type Room = string

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
  NEmpty,
  NSlider,
  NSpace,
  NSpin,
  NSwitch,
  NTag,
} from 'naive-ui'
import { useDeviceStore } from '@/stores/deviceStore'
import { DEVICE_TYPE_LABELS, type Device, type DeviceType } from '@/types/device'

const store = useDeviceStore()

const TAG_TYPE: Partial<Record<DeviceType, 'default' | 'info' | 'success' | 'warning' | 'error'>> = {
  light: 'warning',
  switch: 'info',
  'air-conditioner': 'success',
  curtain: 'default',
  sensor: 'info',
  plug: 'default',
}

onMounted(() => {
  store.fetchDevices()
})

/** n-slider 的单值 value 类型可能是 number | number[]，统一转成 number */
function asNumber(value: number | number[]): number {
  return Array.isArray(value) ? (value[0] ?? 0) : value
}

function onBrightnessChange(device: Device, value: number | number[]) {
  void store.setBrightness(device.id, asNumber(value))
}

function onColorTempChange(device: Device, value: number | number[]) {
  void store.setColorTemp(device.id, asNumber(value))
}
</script>

<template>
  <div>
    <div class="toolbar">
      <span class="muted">{{ store.totalCount }} 台设备 · {{ store.onlineCount }} 台在线</span>
      <n-button size="small" secondary :loading="store.loading" @click="store.fetchDevices()">
        刷新
      </n-button>
    </div>

    <n-alert v-if="store.error" type="warning" show-icon class="page-alert">
      {{ store.error }}
    </n-alert>

    <n-spin :show="store.loading">
      <n-empty
        v-if="store.devices.length === 0 && !store.loading"
        description="暂无设备"
        class="page-empty"
      />

      <div v-else class="device-grid">
        <n-card
          v-for="device in store.devices"
          :key="device.id"
          class="device-card"
          :class="{ offline: !device.online }"
          :title="device.name"
        >
          <template #header-extra>
            <n-space size="small" align="center">
              <n-tag size="small" :type="TAG_TYPE[device.type] ?? 'default'">
                {{ DEVICE_TYPE_LABELS[device.type] }}
              </n-tag>
              <n-tag size="small" :type="device.online ? 'success' : 'default'">
                {{ device.online ? '在线' : '离线' }}
              </n-tag>
            </n-space>
          </template>

          <p class="room">{{ device.room }}</p>

          <template v-if="device.online">
            <div class="control-row">
              <span class="control-label">电源</span>
              <n-switch
                :value="device.power"
                size="medium"
                @update:value="store.togglePower(device.id)"
              />
            </div>

            <div v-if="typeof device.brightness === 'number'" class="control-row">
              <span class="control-label">亮度 {{ device.brightness }}</span>
              <n-slider
                v-model:value="device.brightness"
                :min="0"
                :max="100"
                :step="1"
                @change="onBrightnessChange(device, $event)"
              />
            </div>

            <div v-if="typeof device.colorTemp === 'number'" class="control-row">
              <span class="control-label">色温 {{ device.colorTemp }}K</span>
              <n-slider
                v-model:value="device.colorTemp"
                :min="2700"
                :max="6500"
                :step="100"
                @change="onColorTempChange(device, $event)"
              />
            </div>

            <div v-if="typeof device.temperature === 'number'" class="control-row">
              <span class="control-label">温度</span>
              <span class="muted">{{ device.temperature }}℃</span>
            </div>
          </template>

          <p v-else class="muted">设备离线，无法控制</p>
        </n-card>
      </div>
    </n-spin>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-alert {
  margin-bottom: 16px;
}

.page-empty {
  padding: 40px 0;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.device-card.offline {
  opacity: 0.6;
}

.room {
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 12px;
}

.control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 6px 0;
}

.control-row .n-slider {
  flex: 1;
}

.control-label {
  flex-shrink: 0;
  font-size: 14px;
}
</style>

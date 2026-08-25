<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NAlert, NButton, NCard, NEmpty, NRadioButton, NRadioGroup, NSlider, NSpin, NSwitch, NTag } from 'naive-ui'
import DeviceControlModal from '@/components/DeviceControlModal.vue'
import { useDeviceStore } from '@/stores/deviceStore'
import { DEVICE_TYPE_LABELS, type Device } from '@/types/device'
import {
  applyControl,
  applySlider,
  controlValue,
  DEVICE_CONTROLS,
  sliderValue,
  TAG_TYPE,
  type ControlSpec,
} from '@/views/deviceUi'

const store = useDeviceStore()

/** 当前打开完整控制弹窗的设备 */
const detailDevice = ref<Device | null>(null)
const detailShow = computed({
  get: () => detailDevice.value !== null,
  set: (v: boolean) => {
    if (!v) detailDevice.value = null
  },
})

function openDetail(device: Device) {
  detailDevice.value = device
}

/** 卡片默认显示的控件（前 4 个） */
function visibleControls(d: Device) {
  return DEVICE_CONTROLS[d.type].slice(0, 4)
}

/** 总控件数超过 4 时才需要「···」更多 */
function hasMore(d: Device) {
  return DEVICE_CONTROLS[d.type].length > 4
}

/** 滑块拖拽结束，持久化数值 */
function onSliderChange(device: Device, c: ControlSpec, value: number | number[]) {
  applyControl(device, c, Array.isArray(value) ? (value[0] ?? 0) : value)
}

onMounted(() => {
  store.fetchDevices()
})
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
        >
          <div class="card-inner">
            <!-- 顶部行：设备名称 + 标签（右对齐） -->
            <div class="card-header">
              <span class="device-name">{{ device.name }}</span>
              <div class="header-tags">
                <n-tag size="small" :type="TAG_TYPE[device.type] ?? 'default'">
                  {{ DEVICE_TYPE_LABELS[device.type] }}
                </n-tag>
                <n-tag size="small" :type="device.online ? 'success' : 'default'">
                  {{ device.online ? '在线' : '离线' }}
                </n-tag>
              </div>
            </div>

            <!-- 第二行：房间（左对齐） -->
            <div class="card-room">{{ device.room }}</div>

            <!-- 核心操作区：每行一个控件，默认显示前 4 个 -->
            <div class="core-ops">
              <template v-if="device.online">
                <div v-for="c in visibleControls(device)" :key="c.key" class="core-item">
                  <span class="core-item-name">{{ c.label }}</span>
                  <n-switch
                    v-if="c.kind === 'switch'"
                    :value="controlValue(device, c)"
                    size="small"
                    @update:value="applyControl(device, c, $event)"
                  />
                  <n-radio-group
                    v-else-if="c.kind === 'radio'"
                    size="small"
                    :value="controlValue(device, c)"
                    @update:value="applyControl(device, c, $event)"
                  >
                    <n-radio-button v-for="o in c.options" :key="o.value" :value="o.value">
                      {{ o.label }}
                    </n-radio-button>
                  </n-radio-group>
                  <n-slider
                    v-else
                    :value="sliderValue(device, c)"
                    :min="c.min"
                    :max="c.max"
                    :step="c.step"
                    @update:value="applySlider(device, c, $event)"
                    @change="onSliderChange(device, c, $event)"
                  />
                </div>
              </template>
              <span v-else class="muted">设备离线</span>
            </div>

            <!-- 右下角：总控件数超过 4 个才显示「···」 -->
            <div v-if="hasMore(device)" class="more-btn">
              <n-button size="tiny" quaternary @click="openDetail(device)">···</n-button>
            </div>
          </div>
        </n-card>
      </div>
    </n-spin>

    <DeviceControlModal v-model:show="detailShow" :device="detailDevice" />
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

/* 所有设备卡片固定高度一致 */
.device-card {
  height: 224px;
}

.device-card.offline {
  opacity: 0.6;
}

.device-card :deep(.n-card__content) {
  height: 100%;
  padding: 14px 20px;
}

.card-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.device-name {
  font-size: 15px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-tags {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.card-room {
  color: var(--text-muted);
  font-size: 13px;
  margin-top: 4px;
}

.core-ops {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  min-height: 0;
  overflow: hidden;
}

.core-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.core-item .n-slider {
  flex: 1;
}

.core-item-name {
  font-size: 13px;
  color: var(--text-muted);
}

.more-btn {
  display: flex;
  justify-content: center;
  margin-top: auto;
  line-height: 1;
}
</style>

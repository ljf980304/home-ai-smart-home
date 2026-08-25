<script setup lang="ts">
import { NCard, NModal, NRadioButton, NRadioGroup, NSlider, NSwitch, NTag } from 'naive-ui'
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

const props = defineProps<{ show: boolean; device: Device | null }>()
const emit = defineEmits<{ 'update:show': [value: boolean] }>()

/** 滑块拖拽结束，持久化数值 */
function onSliderChange(c: ControlSpec, value: number | number[]) {
  const d = props.device
  if (!d) return
  applyControl(d, c, Array.isArray(value) ? (value[0] ?? 0) : value)
}
</script>

<template>
  <n-modal :show="show" :on-update:show="(v: boolean) => emit('update:show', v)">
    <n-card
      v-if="device"
      :title="device.name"
      style="width: 420px; max-width: 92vw"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-meta">
        <n-tag size="small" :type="TAG_TYPE[device.type] ?? 'default'">
          {{ DEVICE_TYPE_LABELS[device.type] }}
        </n-tag>
        <span class="muted">{{ device.room }} · {{ device.online ? '在线' : '离线' }}</span>
      </div>

      <div v-for="c in DEVICE_CONTROLS[device.type]" :key="c.key" class="ctrl-row">
        <span class="ctrl-label">{{ c.label }}</span>
        <n-switch
          v-if="c.kind === 'switch'"
          :value="controlValue(device, c)"
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
          @change="onSliderChange(c, $event)"
        />
      </div>
    </n-card>
  </n-modal>
</template>

<style scoped>
.modal-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ctrl-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 6px 0;
}

.ctrl-row .n-slider {
  flex: 1;
}

.ctrl-label {
  flex-shrink: 0;
  font-size: 14px;
}
</style>

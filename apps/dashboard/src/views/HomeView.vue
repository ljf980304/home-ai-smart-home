<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  NAlert,
  NCard,
  NEmpty,
  NGi,
  NGrid,
  NSpin,
  NStatistic,
  NSwitch,
  NTag,
} from 'naive-ui'
import { useDeviceStore } from '@/stores/deviceStore'
import { useSceneStore } from '@/stores/sceneStore'
import { DEVICE_TYPE_LABELS, type Device } from '@/types/device'

const deviceStore = useDeviceStore()
const sceneStore = useSceneStore()

onMounted(() => {
  deviceStore.fetchDevices()
  sceneStore.fetchScenes()
})

/** 支持快捷开关的设备：在线 + 具备电源开关属性 */
function isControllable(d: Device) {
  return (
    d.online &&
    (d.type === 'light' || d.type === 'switch' || d.type === 'plug' || d.type === 'air-conditioner')
  )
}

const controllableDevices = computed(() => deviceStore.devices.filter(isControllable))
</script>

<template>
  <div>
    <n-alert v-if="deviceStore.error || sceneStore.error" type="warning" show-icon class="page-alert">
      {{ deviceStore.error || sceneStore.error }}
    </n-alert>

    <n-spin :show="deviceStore.loading || sceneStore.loading">
      <n-grid :cols="2" :x-gap="16" :y-gap="16">
        <n-gi>
          <n-card title="设备概况">
            <div class="stat-row">
              <n-statistic label="设备总数" :value="deviceStore.totalCount" />
              <n-statistic label="在线设备" :value="deviceStore.onlineCount" />
              <n-statistic label="运行场景" :value="sceneStore.enabledCount" />
            </div>
          </n-card>
        </n-gi>

        <n-gi>
          <n-card title="类型分布">
            <div v-if="deviceStore.byType.size === 0" class="muted">暂无数据</div>
            <div v-else class="type-list">
              <div v-for="[type, list] in deviceStore.byType" :key="type" class="type-row">
                <n-tag size="small">{{ DEVICE_TYPE_LABELS[type] }}</n-tag>
                <span class="muted">{{ list.length }} 台</span>
              </div>
            </div>
          </n-card>
        </n-gi>
      </n-grid>
    </n-spin>

    <n-card title="快捷控制" class="section-card">
      <n-empty v-if="controllableDevices.length === 0" description="暂无可控设备" />
      <div v-else class="quick-grid">
        <div v-for="device in controllableDevices" :key="device.id" class="quick-item">
          <div class="quick-info">
            <span class="quick-name">{{ device.name }}</span>
            <span class="muted">{{ device.room }}</span>
          </div>
          <n-switch
            :value="device.power"
            size="medium"
            @update:value="deviceStore.togglePower(device.id)"
          />
        </div>
      </div>
    </n-card>

    <n-card title="按房间" class="section-card">
      <div v-if="deviceStore.byRoom.size === 0" class="muted">暂无设备</div>
      <div v-for="[room, list] in deviceStore.byRoom" :key="room" class="room-block">
        <h3 class="room-title">{{ room }}</h3>
        <div class="room-devices">
          <n-tag
            v-for="device in list"
            :key="device.id"
            size="small"
            :type="device.online ? 'success' : 'default'"
          >
            {{ device.name }}
          </n-tag>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.page-alert {
  margin-bottom: 16px;
}

.stat-row {
  display: flex;
  gap: 32px;
}

.section-card {
  margin-top: 16px;
}

.type-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.type-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px 16px;
}

.quick-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}

.quick-info {
  display: flex;
  flex-direction: column;
}

.quick-name {
  font-size: 14px;
}

.room-block {
  padding: 8px 0;
}

.room-block + .room-block {
  border-top: 1px solid var(--border);
}

.room-title {
  margin: 0 0 8px;
  font-size: 14px;
}

.room-devices {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>

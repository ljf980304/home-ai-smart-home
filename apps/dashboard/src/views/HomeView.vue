<script setup lang="ts">
const stats = [
  { label: '在线设备', value: '0' },
  { label: '运行场景', value: '0' },
  { label: '今日告警', value: '0' },
]
</script>

<template>
  <section>
    <p class="muted">
      欢迎使用家庭 AI 智能家居控制面板，这里将展示家庭设备的实时状态。
    </p>

    <div class="stats">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </div>

    <div class="placeholder">
      <p>更多总览模块（能耗统计、状态图表等）规划中。</p>
    </div>
  </section>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 600;
  color: var(--text-strong);
}

.stat-label {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-muted);
}
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { RouterView } from 'vue-router'
import {
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  dateZhCN,
  darkTheme,
  zhCN,
} from 'naive-ui'

// 跟随系统深色模式
const media = window.matchMedia('(prefers-color-scheme: dark)')
const isDark = ref(media.matches)
const onMediaChange = (e: MediaQueryListEvent) => {
  isDark.value = e.matches
}
media.addEventListener('change', onMediaChange)
onBeforeUnmount(() => media.removeEventListener('change', onMediaChange))

const theme = computed(() => (isDark.value ? darkTheme : null))
</script>

<template>
  <n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-dialog-provider>
        <RouterView />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

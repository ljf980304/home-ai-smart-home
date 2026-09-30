<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { isDemoMode } from '@/services/demo'

const route = useRoute()

/** 演示站的源码仓库，提示条里给个回跳入口 */
const REPO_URL = 'https://github.com/ljf980304/home-ai-smart-home'

const navItems = [
  { to: '/', label: '总览' },
  { to: '/devices', label: '设备' },
  { to: '/scenes', label: '场景' },
  { to: '/settings', label: '设置' },
]

const pageTitle = computed(() => (route.meta.title as string) ?? '家庭 AI 智能家居')

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">🏠</span>
        <span class="brand-name">Home AI</span>
      </div>

      <nav class="nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: isActive(item.to) }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>

    <div class="main">
      <div v-if="isDemoMode" class="demo-banner">
        <strong>静态演示数据</strong>
        <span>后端未连接，操作只存在于本次浏览、刷新即重置</span>
        <a :href="REPO_URL" target="_blank" rel="noopener">源码仓库</a>
      </div>

      <header class="header">
        <h1>{{ pageTitle }}</h1>
      </header>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100svh;
}

.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 20px;
}

.brand-mark {
  font-size: 22px;
}

.brand-name {
  color: var(--sidebar-text-active);
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.2px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--sidebar-text);
  text-decoration: none;
  font-size: 14px;
  transition:
    background 0.15s,
    color 0.15s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--sidebar-text-active);
}

.nav-link.active {
  background: var(--accent);
  color: var(--sidebar-text-active);
}

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* 演示模式提示条：只有 VITE_DEMO=true 的构建才渲染 */
.demo-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
  padding: 10px 28px;
  background: #fff7e6;
  border-bottom: 1px solid #ffd591;
  color: #874d00;
  font-size: 13px;
  line-height: 1.6;
}

.demo-banner strong {
  font-weight: 600;
}

.demo-banner a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

@media (prefers-color-scheme: dark) {
  .demo-banner {
    background: #2b2113;
    border-bottom-color: #5c4318;
    color: #ffd591;
  }
}

.header {
  padding: 20px 28px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.header h1 {
  margin: 0;
  font-size: 20px;
}

.content {
  padding: 28px;
  flex: 1;
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 12px 16px;
  }

  .brand {
    border-bottom: none;
    margin-bottom: 0;
    padding: 0;
    margin-right: 16px;
  }

  .nav {
    flex-direction: row;
    gap: 8px;
  }

  .demo-banner {
    padding: 10px 20px;
  }

  .header {
    padding: 16px 20px;
  }

  .content {
    padding: 20px;
  }
}
</style>

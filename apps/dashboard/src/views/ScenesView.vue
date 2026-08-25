<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
  NEmpty,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NPopconfirm,
  NSpin,
  NSwitch,
  useMessage,
} from 'naive-ui'
import { useSceneStore } from '@/stores/sceneStore'
import type { Scene } from '@/types/scene'

const store = useSceneStore()
const message = useMessage()

onMounted(() => {
  store.fetchScenes()
})

const showCreate = ref(false)
const submitting = ref(false)
const form = ref({ name: '', description: '' })

async function handleCreate() {
  const name = form.value.name.trim()
  if (!name) {
    message.warning('请输入场景名称')
    return
  }
  submitting.value = true
  try {
    await store.createScene({ name, description: form.value.description.trim() || undefined })
    message.success(`场景「${name}」创建成功`)
    showCreate.value = false
    form.value = { name: '', description: '' }
  } catch (e) {
    message.error(e instanceof Error ? e.message : '创建失败')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(scene: Scene) {
  try {
    await store.deleteScene(scene.id)
    message.success(`场景「${scene.name}」已删除`)
  } catch (e) {
    message.error(e instanceof Error ? e.message : '删除失败')
  }
}
</script>

<template>
  <div>
    <div class="toolbar">
      <span class="muted">{{ store.scenes.length }} 个场景 · {{ store.enabledCount }} 个启用</span>
      <n-button size="small" secondary :loading="store.loading" @click="store.fetchScenes()">
        刷新
      </n-button>
      <n-button type="primary" size="small" @click="showCreate = true">新建场景</n-button>
    </div>

    <n-alert v-if="store.error" type="warning" show-icon class="page-alert">
      {{ store.error }}
    </n-alert>

    <n-spin :show="store.loading">
      <n-empty
        v-if="store.scenes.length === 0 && !store.loading"
        description="暂无场景"
        class="page-empty"
      />

      <div v-else class="scene-list">
        <n-card v-for="scene in store.scenes" :key="scene.id" class="scene-card">
          <div class="scene-body">
            <div class="scene-info">
              <h3 class="scene-name">{{ scene.name }}</h3>
              <p class="muted">{{ scene.description || '（无描述）' }}</p>
            </div>
            <div class="scene-actions">
              <n-switch
                :value="scene.enabled"
                size="medium"
                @update:value="store.toggleEnabled(scene.id)"
              />
              <n-popconfirm @positive-click="handleDelete(scene)">
                <template #trigger>
                  <n-button size="small" quaternary type="error">删除</n-button>
                </template>
                确定删除场景「{{ scene.name }}」吗？
              </n-popconfirm>
            </div>
          </div>
        </n-card>
      </div>
    </n-spin>

    <n-modal v-model:show="showCreate" preset="card" title="新建场景" style="width: 480px">
      <n-form label-placement="left" :label-width="80">
        <n-form-item label="名称" required>
          <n-input v-model:value="form.name" placeholder="如：回家模式" />
        </n-form-item>
        <n-form-item label="描述">
          <n-input
            v-model:value="form.description"
            type="textarea"
            placeholder="可选，简单描述场景用途"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="modal-footer">
          <n-button @click="showCreate = false">取消</n-button>
          <n-button type="primary" :loading="submitting" @click="handleCreate">创建</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.toolbar .muted {
  margin-right: auto;
}

.page-alert {
  margin-bottom: 16px;
}

.page-empty {
  padding: 40px 0;
}

.scene-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scene-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.scene-info {
  min-width: 0;
}

.scene-name {
  margin: 0 0 4px;
  font-size: 16px;
}

.scene-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

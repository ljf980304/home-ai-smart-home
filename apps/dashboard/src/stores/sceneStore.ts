import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as sceneService from '@/services/sceneService'
import type { Scene } from '@/types/scene'

export const useSceneStore = defineStore('scene', () => {
  const scenes = ref<Scene[]>([])
  const loading = ref(false)
  const error = ref('')

  const enabledCount = computed(() => scenes.value.filter((s) => s.enabled).length)

  async function fetchScenes() {
    loading.value = true
    error.value = ''
    try {
      scenes.value = await sceneService.getScenes()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载场景失败'
    } finally {
      loading.value = false
    }
  }

  async function createScene(data: Pick<Scene, 'name' | 'description'>) {
    const scene = await sceneService.createScene(data)
    scenes.value.push(scene)
    return scene
  }

  async function deleteScene(id: string) {
    await sceneService.deleteScene(id)
    scenes.value = scenes.value.filter((s) => s.id !== id)
  }

  /** 启用开关（乐观更新，失败回滚） */
  async function toggleEnabled(id: string) {
    const scene = scenes.value.find((s) => s.id === id)
    if (!scene) return
    const target = !scene.enabled
    scene.enabled = target
    try {
      await sceneService.setSceneEnabled(id, target)
    } catch (e) {
      scene.enabled = !target
      error.value = e instanceof Error ? e.message : '操作失败'
    }
  }

  return {
    scenes,
    loading,
    error,
    enabledCount,
    fetchScenes,
    createScene,
    deleteScene,
    toggleEnabled,
  }
})

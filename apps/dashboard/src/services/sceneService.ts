import { http } from './http'
import type { Scene } from '@/types/scene'

export function getScenes() {
  return http.get<Scene[]>('/scenes')
}

export function createScene(data: Pick<Scene, 'name' | 'description'>) {
  return http.post<Scene>('/scenes', data)
}

export function deleteScene(id: string) {
  return http.delete<void>(`/scenes/${id}`)
}

export function setSceneEnabled(id: string, enabled: boolean) {
  return http.patch<Scene>(`/scenes/${id}`, { enabled })
}

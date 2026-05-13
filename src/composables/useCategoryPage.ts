import { useEvents } from './useEvents'

export function useCategoryPage(categoryId: string) {
  return useEvents(categoryId, { autoLoad: true, checkAdmin: true })
}

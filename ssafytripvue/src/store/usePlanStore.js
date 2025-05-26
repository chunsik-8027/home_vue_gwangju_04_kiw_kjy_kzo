import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlanStore = defineStore('plan', () => {
  // selectedItems: 전역에서 접근할 수 있는 배열
  const selectedItems = ref([])

  function setSelectedItems(items) {
    selectedItems.value = items
  }

  return { selectedItems, setSelectedItems }
})

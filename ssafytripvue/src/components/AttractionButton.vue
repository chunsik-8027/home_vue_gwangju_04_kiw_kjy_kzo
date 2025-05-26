<template>
  <div class="SearchButton">
    <button @click="handleSearch">검색</button>
  </div>
</template>

<script setup>

import { api } from '@/axios'
import { ref, watch } from 'vue'
const list = ref([])
const emit = defineEmits(['searchResults'])

const props = defineProps({
  city: String,
  gun: String,
  type: String,
})

const handleSearch = async () => {
  //console.log(props.city, props.gun, props.type)
  if (!props.city || !props.gun || !props.type) {
    alert('모든 항목을 선택해주세요')
    return
  }

  try {
    const response = await api.get('/api/attractions/search', {
      params: {
        sido: props.city,
        sigungu: props.gun,
        contentType: props.type,
      },
    })
    list.value = response.data
    //console.log('list : ', list.value)
  } catch (error) {
    console.log(error)
    alert('검색 중 요류 발생')
  }
}

watch(list, (newList) => {
  //console.log('newList', newList)
  emit('searchResults', newList)
})
</script>

<style scoped>
.SearchButton {
  height: 50px;
}

button {
  height: 100%;
  width: 62px;
  border-radius: 8px;
  background-color: #1b56fd;
  color: white;
  font-weight: bold;
}

button:hover {
  background-color: black;
}

button:active {
  transform: scale(0.97);
  /* 약간 줄여서 눌린 듯한 효과 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  /* 안쪽 그림자 */
}
</style>

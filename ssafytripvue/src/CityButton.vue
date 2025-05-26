<template>
  <div class="CityGroup">
    <select class="City" v-model="selectedCity">
      <option disabled value="">지역 선택</option>
      <option v-for="item in optionsCity" :key="item" :value="item">
        {{ item }}
      </option>
    </select>

    <select class="City" v-model="selectedGun">
      <option disabled value="">구 선택</option>

      <option v-if="selectedCity.length === 0" disabled></option>

      <option v-else v-for="item in optionsGun" :key="item" :value="item">
        {{ item }}
      </option>
    </select>

    <select class="City" v-model="selectedType">
      <option disabled value="">여행 타입</option>
      <option v-if="selectedGun.length === 0" disabled></option>
      <option v-else v-for="item in TripType" :key="item" :value="item">
        {{ item }}
      </option>
    </select>
    <AttractionButton :city="selectedCity" :gun="selectedGun" :type="selectedType"
      @searchResults="handleSearchResults" />
  </div>
</template>

<script setup>
import AttractionButton from './components/AttractionButton.vue'
import { ref, watch } from 'vue'

import { api } from '@/axios'

defineProps({
  optionsCity: {
    type: Array,
    required: true,
  },
})

const selectedCity = ref('') // 선택된 값
const optionsGun = ref([])
const selectedGun = ref('') // 선택된 값

watch(selectedCity, async (newCity) => {
  if (!newCity) return

  try {
    const response = await api.get(`/api/attractions/regions`, {
      params: { sido: newCity },
    })

    optionsGun.value = response.data
    selectedGun.value = ''
    selectedType.value = ''
    console.log(optionsGun)
  } catch (error) {
    console.log(error)
    optionsGun.value = []
    selectedGun.value = ''
    selectedType.value = ''
  }
})

const TripType = ref(['관광지', '문화시설', '레포츠', '숙박', '쇼핑', '음식점'])
const selectedType = ref('') // 선택된 값

watch([selectedCity, selectedGun, selectedType], ([city, gun, type]) => {
  if (city && gun && type) {
    console.log('선택 완료:', { city, gun, type })
  }
})

const emit = defineEmits(['searchResults'])
const handleSearchResults = (list) => {
  emit('searchResults', {
    list,
    city: selectedCity.value,
    gun: selectedGun.value,
    type: selectedType.value,
  })
}
</script>

<style scoped>
.CityGroup {
  display: flex;
  gap: 13px;
  /* 선택창 사이의 간격 */
  height: 50px;
}

.City {
  width: 117px;
  height: 50px;
  text-align: center;
  border-radius: 8px;
}

select {
  font-size: 16px;
  padding: 5px;
  height: 40px;
}
</style>

<template>
    <div class="page-wrapper">
        <header>
            <HeaderTop />
        </header>

        <main>
            <div class="ButtonType">
                <TitleButton @click="showSearch" />
                <MapButton @click="showCity" />
                <LikeButton @click="showSearch" />
            </div>
            <div class="SearchButton">
                <SearchButton v-if="currentComponent === 'search'" />
                <CityButton v-if="currentComponent === 'city'" />
            </div>
        </main>

        <div class="plan-map">
            <div class="plan">
                <div class="filters">
                    <select v-model="selectedSido" @change="onSidoChange">
                        <option disabled value="">시도 선택</option>
                        <option v-for="sido in sidoList" :key="sido" :value="sido">{{ sido }}</option>
                    </select>
                    <select v-model="selectedSigungu">
                        <option disabled value="">시군구 선택</option>
                        <option v-for="sg in sigunguList" :key="sg" :value="sg">{{ sg }}</option>
                    </select>
                    <select v-model="selectedContentType">
                        <option disabled value="">관광타입 선택</option>
                        <option v-for="type in contentTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                    <button @click="searchAttractions">검색</button>
                </div>

                <div class="place-list">
                    <h3>장소 목록</h3>
                    <ul>
                        <li v-for="(place, index) in dbPlaces" :key="index" @click="highlightPlace(place)">
                            {{ place.name || place.title || '이름 없음' }}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="map" ref="mapContainer"></div>
        </div>
    </div>
</template>

<script setup>
import TitleButton from '@/TitleButton.vue'
import MapButton from '@/MapButton.vue'
import LikeButton from '@/LikeButton.vue'
import SearchButton from '@/SearchButton.vue'
import CityButton from '@/CityButton.vue'

import { ref, onMounted } from 'vue'
import axios from 'axios'

const currentComponent = ref('search')
const showSearch = () => (currentComponent.value = 'search')
const showCity = () => (currentComponent.value = 'city')

const mapContainer = ref(null)
let map = null
const markers = []
const markerMap = new Map()

const selectedSido = ref('')
const selectedSigungu = ref('')
const selectedContentType = ref('')
const sidoList = ref([])
const sigunguList = ref([])
const selectedPlace = ref(null)
const dbPlaces = ref([])

const contentTypes = [
    '관광지', '문화시설', '축제공연행사', '여행코스',
    '레포츠', '숙박', '쇼핑', '음식점'
]

onMounted(async () => {
    map = new window.kakao.maps.Map(mapContainer.value, {
        center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
        level: 4
    })
    const res = await axios.get('/api/attractions')
    sidoList.value = res.data
})

const onSidoChange = async () => {
    selectedSigungu.value = ''
    sigunguList.value = []
    if (!selectedSido.value) return
    const res = await axios.get(`/api/attractions/regions?sido=${selectedSido.value}`)
    sigunguList.value = res.data
}

async function searchAttractions() {
    if (!selectedSido.value || !selectedSigungu.value || !selectedContentType.value) {
        alert('모든 조건을 선택해주세요.')
        return
    }

    try {
        markers.forEach(m => m.setMap(null))
        markers.length = 0
        dbPlaces.value = []
        markerMap.clear()

        const { data } = await axios.get('/api/attractions/search', {
            params: {
                sido: selectedSido.value,
                sigungu: selectedSigungu.value,
                contentType: selectedContentType.value
            }
        })
        dbPlaces.value = data
    } catch (e) {
        console.error(' [검색 실패]', e)
        alert('조회 중 오류가 발생했습니다.')
    }
}

function highlightPlace(place) {
    const key = `${place.lat}_${place.lon}`
    if (markerMap.has(key)) {
        const existingMarker = markerMap.get(key)
        existingMarker.setMap(null)
        markerMap.delete(key)
        return
    }

    const pos = new window.kakao.maps.LatLng(place.lat, place.lon)
    const marker = new window.kakao.maps.Marker({ map, position: pos })
    markerMap.set(key, marker)

    map.setCenter(pos)
    map.setLevel(7)

    window.kakao.maps.event.addListener(marker, 'click', () => {
        selectedPlace.value = place
    })
}
</script>

<style scoped>
.page-wrapper {
    display: flex;
    flex-direction: column;
}

.ButtonType {
    display: flex;
    width: 450px;
    gap: 20px;
    padding-top: 20px;
    padding-left: 30px;
    padding-right: 25px;
}

.SearchButton {
    padding-left: 30px;
    padding-top: 20px;
    height: 80px;
}

.plan-map {
    display: flex;
    gap: 30px;
    padding: 20px 30px;
}

.plan {
    width: 450px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    height: fit-content;
    max-height: 1000px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.filters {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.filters select,
.filters button {
    padding: 10px;
    font-size: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: white;
    cursor: pointer;
}

.filters button {
    background-color: #4a90e2;
    color: white;
    font-weight: bold;
    transition: background 0.3s;
}

.filters button:hover {
    background-color: #357acc;
}

.place-list {
    flex-grow: 1;
    max-height: 500px;
    overflow-y: auto;
    border-top: 1px solid #ccc;
    padding-top: 15px;
}

.place-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.place-list li {
    padding: 10px 12px;
    margin-bottom: 8px;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid #eee;
    cursor: pointer;
    transition: all 0.2s;
}

.place-list li:hover {
    background-color: #f0f8ff;
    border-color: #a3d1ff;
}

.map {
    background-color: gray;
    flex: 1;
    height: 1000px;
}
</style>

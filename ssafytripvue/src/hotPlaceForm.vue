<template>
    <header>
        <HeaderTop />
    </header>
    <div class="hotplace-page">
        <nav class="tabs">
            <button class="tab" :class="{ active: mode === 'region' }" @click="switchToRegion">지역별 핫플</button>
            <button class="tab" :class="{ active: mode === 'theme' }" @click="switchToTheme">테마별 핫플</button>
        </nav>

        <h2 class="section-title">SSAFY TRIP</h2>

        <div v-if="mode === 'theme'" class="grid">
            <HotplaceCard v-for="(place, idx) in visiblePlaces" :key="idx" :place="place" :likedList="likedAnoList"
                @openModal="openModal" @addLike="addLike" @removeLike="removeLike" />
        </div>

        <div v-else>
            <div v-for="(group, idx) in regionGroups" :key="idx">
                <h3 class="region-title">{{ group.sido }}</h3>
                <div class="grid">
                    <HotplaceCard v-for="(place, idx2) in group.places" :key="idx2" :place="place"
                        :likedList="likedAnoList" @openModal="openModal" @addLike="addLike" @removeLike="removeLike" />
                </div>
            </div>
        </div>

        <div ref="scrollObserver" class="scroll-trigger" />
        <HotplaceModal v-if="selectedPlace" :place="selectedPlace" @close="closeModal" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import HeaderTop from '@/components/Fragments/HeaderTop.vue'
import HotplaceCard from '@/hotPlace.vue'
import HotplaceModal from '@/hotplaceModal.vue'
import { useRoute } from 'vue-router'
import { api } from '@/axios'

/* 공통 상태 */
const mode = ref('theme')
const scrollObserver = ref(null)
const selectedPlace = ref(null)
const route = useRoute()
const placeParam = ref(route.query.place)
/* 테마별 */
const visiblePlaces = ref([])
const themeOffset = ref(1)
const themeIsEnd = ref(false)
import { useMemberStore } from '@/store/member'

const store = useMemberStore()
/* 지역별 */
const SIDO_LIST = [
    '서울', '부산', '인천', '제주도', // 기본 API 대상
    '속초', '여수', '가평', '경주', '강릉', '거제' // condition-search 대상
]

// condition-search용 gugun 번호 매핑
const gugunNoMap = {
    '속초': 346,
    '여수': 455,
    '가평': 311,
    '경주': 388,
    '강릉': 342,
    '거제': 409,
}
const sidoIndex = ref(0)
const regionGroups = ref([])
const likedAnoList = ref([])



async function fetchTheme() {
    if (themeIsEnd.value) return

    const place = placeParam.value
    console.log(`[테마 호출] place=${place}, offset=${themeOffset.value}`)

    try {
        let data = []

        if (gugunNoMap[place]) {
            // gugun 기반 API
            const res = await api.get('/api/hotplaces/gugun', {
                params: { no: gugunNoMap[place], offset: themeOffset.value }
            })
            data = res.data
        } else {
            // sido 기반 API
            const res = await api.get('/api/hotplaces/sido', {
                params: { sido: place, offset: themeOffset.value }
            })
            data = res.data
        }

        console.table(data)

        if (!data.length) {
            themeIsEnd.value = true
            console.log(`[테마 호출] 종료됨`)
        } else {
            visiblePlaces.value.push(...data)
            themeOffset.value++
            console.log(`[테마 호출] 데이터 ${data.length}건 수신`)
        }
    } catch (e) {
        console.error('[테마별 API 실패]', e)
    }
}

async function fetchNextSidoOnce() {
    if (sidoIndex.value >= SIDO_LIST.length) return
    const sido = SIDO_LIST[sidoIndex.value]
    console.log(`[지역 호출] sido=${sido}, index=${sidoIndex.value}`)

    try {
        let data = []

        if (['서울', '부산', '인천', '제주도'].includes(sido)) {
            const res = await api.get('/api/hotplaces/sido', {
                params: { sido, offset: 1 },
            })
            data = res.data
        } else {
            const no = gugunNoMap[sido]
            if (!no) {
                console.warn(`[지역 호출] ${sido}는 gugun 번호가 없습니다.`)
                sidoIndex.value++
                return
            }
            const res = await api.get('/api/attractions/condition-search', {
                params: { no },
            })
            data = res.data
        }

        regionGroups.value.push({ sido, places: data })
        console.table(data)
        console.log(`[지역 호출] ${sido} 데이터 ${data.length}건 수신`)
    } catch (e) {
        console.error(`[${sido}] API 실패`, e)
    } finally {
        sidoIndex.value++
    }
}

function switchToTheme() {
    if (mode.value === 'theme') return
    mode.value = 'theme'
    fetchTheme()

}

function switchToRegion() {
    if (mode.value === 'region') return
    mode.value = 'region'

}

function openModal(p) {
    selectedPlace.value = p
}
function closeModal() {
    selectedPlace.value = null
}
function addLike(ano) {
    if (!likedAnoList.value.includes(ano)) {
        likedAnoList.value = [...likedAnoList.value, ano] // 새 배열 할당(즉시 렌더)
    }
}
function removeLike(ano) {
    likedAnoList.value = likedAnoList.value.filter(a => a !== ano)
}
onMounted(async () => {
    // 초기에는 현재 모드에 따라 데이터 불러오기
    const mno = store.loginUser?.mno
    if (mno) {
        const res = await api.get(`/api/hotplaces/likesList/${mno}`)
        likedAnoList.value = res.data
    }
    const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return

        if (mode.value === 'theme' && themeOffset.value === 1 && visiblePlaces.value.length === 0) {
            fetchTheme()
        } else if (mode.value === 'theme') {
            fetchTheme()
        } else {
            fetchNextSidoOnce()
        }
    })
    observer.observe(scrollObserver.value)
})
</script>

<style scoped>
.tabs {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.tab {
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    padding: 0.6rem 1.4rem;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    transition: 0.3s ease;
}

.tab:hover {
    background-color: #e0e0e0;
}

.tab.active {
    background-color: #1a73e8;
    color: white;
    border-color: #1a73e8;
    font-weight: 600;
}

.section-title {
    font-size: 2rem;
    font-weight: bold;
    color: #222;
    margin-bottom: 2rem;
    text-align: center;
}

.region-title {
    font-size: 1.3rem;
    font-weight: bold;
    margin: 3rem 0 1rem 0.5rem;
    padding-left: 0.5rem;
    border-left: 4px solid #1a73e8;
    color: #333;
}

.region-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 2rem 0 1rem 0.5rem;
}

.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
}

@media (max-width: 1200px) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .grid {
        grid-template-columns: 1fr;
    }
}

.scroll-trigger {
    height: 1px;
}
</style>

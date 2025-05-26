<template>

    <div class="plan-detail-root">
        <HeaderTop />
        <div class="main">
            <div class="DetailList"></div>
            <div class="Map" ref="mapContainer"></div>
        </div>
    </div>

</template>

<script setup>
import HeaderTop from './components/Fragments/HeaderTop.vue'
import { usePlanStore } from '@/store/usePlanStore'
import { ref, onMounted } from 'vue'

const planStore = usePlanStore()
console.log(planStore.selectedItems)


let map = null
const mapContainer = ref(null)

onMounted(() => {
    if (window.kakao && mapContainer.value) {
        map = new window.kakao.maps.Map(mapContainer.value, mapOption)
    }
})
const mapOption = {
    center: new window.kakao.maps.LatLng(36.3, 127.8), // 대한민국 중심 좌표
    //center: new kakao.maps.LatLng(37.517236, 127.047325), // 대한민국 중심 좌표
    //level : 6
    level: 12

}
</script>

<style scoped>
.plan-detail-root {
    height: 100vh;
    /* 화면 전체 높이 */
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.plan-detail-root .main {
    display: flex;
    flex: 1 0 0;
    /* 남은 높이 모두 차지 */
    min-height: 0;
}

.DetailList {
    width: 50%;
    height: 100%;
    background-color: black;
}


.Map {
    background-color: gray;
    width: 50%;
    height: 100%;
}
</style>

<template>
  <div ref="skyRef" class="sky" style="position: relative; width: 100vw; height: 250px">
    <!-- 비행기 -->
    <img src="@/assets/img/airplane.png" :style="{
      position: 'absolute',
      left: posX + 'px',
      top: posY + 'px',
      width: planeWidth + 'px',
    }" alt="airplane" />
    <!-- 자동차 -->
    <img src="@/assets/img/car.png" :style="{
      position: 'absolute',
      left: carX + 'px',
      top: carY + 'px',
      width: carWidth + 'px',
    }" alt="car" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 비행기
const posX = ref(0)
const posY = ref(0)
const planeWidth = 100

// 자동차
const carX = ref(0)
const carY = ref(0)
const carWidth = 80

const skyRef = ref(null)
let intervalId = null
let maxX = 0
let minX = 0

// 비행기 곡선 변수
const planeCenterY = 100 // 비행기 높이
const planeAmplitude = 100 // 비행기 곡선 높이
const planeFrequency = 0.02 // 비행기 곡선 주기

// 자동차 곡선 변수
const carCenterY = 300 // 자동차 높이 (비행기보다 아래)
const carAmplitude = 0 // 자동차 곡선 높이
const carFrequency = 0.035 // 자동차 곡선 주기 (다르게 하면 더욱 재미있음)

onMounted(() => {
  setTimeout(() => {
    const skyWidth = skyRef.value?.offsetWidth || window.innerWidth
    maxX = skyWidth - planeWidth
    minX = 0
    carX.value = skyWidth - carWidth // 자동차 시작은 오른쪽 끝
  }, 50)

  intervalId = setInterval(() => {
    // 비행기 (왼쪽 → 오른쪽)
    if (posX.value < maxX) {
      posX.value += 2
    } else {
      posX.value = 0
    }
    posY.value = planeCenterY + planeAmplitude * Math.sin(planeFrequency * posX.value)

    // 자동차 (오른쪽 → 왼쪽)
    if (carX.value > minX) {
      carX.value -= 3 // 자동차가 더 빠르거나 느리게 하고싶으면 이 수치 변경!
    } else {
      carX.value = (skyRef.value?.offsetWidth || window.innerWidth) - carWidth
    }
    carY.value = carCenterY + carAmplitude * Math.cos(carFrequency * carX.value)
  }, 16)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

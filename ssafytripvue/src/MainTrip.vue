<template>
  <div :class="{ blurred: showCalendar }">
    <header>
      <Header />
    </header>
    <div>
      <AirplaneAnimation />
    </div>
    <div class="first-page">
      <div class="blue-annie" ref="titleRef"></div>
      <div class="mid">
        <div class="J">
          <span class="J-top">J들아 모여 너희 들을 위한 여행 계획</span><br />
          <span class="J-bottom">지금 계획을 세우세요.</span>
        </div>
        <!-- <div class="my-plan">
          <router-link :to="{ path: '/MyPlan' }" class="MY">마이로 시작</router-link>
        </div> -->

        <router-link class="MY" :to="''" @click.prevent="showCalendar = true">마이로 시작</router-link>

        <div v-if="showCalendar" class="overlay">
          <div class="calendar-modal">
            <CalendarView @close="showCalendar = false" />
          </div>
        </div>
      </div>
      <div class="words">할인</div>
    </div>

    <div class="second-page">
      <div class="hot-place-text">
        <h2>핫플 여행지 둘러보기</h2>
      </div>
    </div>
    <div class="travel-container">
      <router-link :to="{ path: '/hotplace', query: { place: '제주도' } }" class="travel-card">
        <img src="./assets/img/Jeju.png" alt="제주도" />
        <div class="label">제주도</div>
      </router-link>

      <router-link :to="{ path: '/hotplace', query: { place: '속초' } }" class="travel-card">
        <img src="./assets/img/sokcho.png" alt="속초" />
        <div class="label">속초</div>
      </router-link>

      <router-link :to="{ path: '/hotplace', query: { place: '여수' } }" class="travel-card">
        <img src="./assets/img/Yeosu.png" alt="여수" />
        <div class="label">여수</div>
      </router-link>

      <router-link :to="{ path: '/hotplace', query: { place: '가평' } }" class="travel-card">
        <img src="./assets/img/gapung.png" alt="가평" />
        <div class="label">가평</div>
      </router-link>

      <router-link :to="{ path: '/hotplace', query: { place: '서울' } }" class="travel-card">
        <img src="./assets/img/seoul.png" alt="서울" />
        <div class="label">서울</div>
      </router-link>

      <router-link :to="{ path: '/hotplace', query: { place: '부산' } }" class="travel-card">
        <img src="./assets/img/haeundae.png" alt="부산" />
        <div class="label">부산</div>
      </router-link>

      <router-link :to="{ path: '/hotplace', query: { place: '경주' } }" class="travel-card">
        <img src="./assets/img/gungju.png" alt="경주" />
        <div class="label">경주</div>
      </router-link>

      <router-link :to="{ path: '/hotplace', query: { place: '인천' } }" class="travel-card">
        <img src="./assets/img/incheun.png" alt="인천" />
        <div class="label">인천</div>
      </router-link>

      <router-link :to="{ path: '/hotplace', query: { place: '강릉' } }" class="travel-card">
        <img src="./assets/img/gangreung.png" alt="강릉" />
        <div class="label">강릉</div>
      </router-link>

      <router-link :to="{ path: '/hotplace', query: { place: '거제' } }" class="travel-card">
        <img src="./assets/img/gujea.png" alt="거제" />
        <div class="label">거제</div>
      </router-link>

      <!-- 다른 지역들도 동일하게 추가 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/Fragments/HeaderTop.vue'
import AirplaneAnimation from '@/components/AirplaneAnimation.vue'
import CalendarView from '@/CalendarView.vue'
const showCalendar = ref(false)
const titleRef = ref(null)
const text = 'AI SSAFY TRIP'
let currentIndex = 0

onMounted(() => {
  const intervalId = setInterval(() => {
    if (titleRef.value && currentIndex <= text.length) {
      titleRef.value.innerHTML = text.substring(0, currentIndex)
      currentIndex++
    } else if (currentIndex > text.length) {
      currentIndex = 0
    }
  }, 150)
})
</script>

<style scoped>
.first-page {
  display: block;
}

.blue-annie {
  color: #69d1f4;
  font-family: 'Inter', Helvetica;
  font-size: 64px;
  font-weight: 700;
  height: 78px;
  letter-spacing: -1.28px;
  line-height: normal;
  text-align: center;
  margin-top: 300px;
  margin-bottom: 100px;
}

.mid {
  display: flex;
  align-items: center;
  gap: 50px;
  flex-direction: row;
  justify-content: center;
  /* 가운데 정렬 */
}

.J-top {
  color: #000;
  font-family: Inter;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.96px;
}

.J-bottom {
  color: #000;
  font-family: Inter;
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.96px;
}

.MY {
  width: 120px;
  height: 50px;
  border-radius: 8px;
  background: #000;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  color: white;
  margin-top: 30px;
  margin-left: 20px;
  text-align: center;
  display: flex;
  /* flex 컨테이너로 변경 */
  align-items: center;
  /* 세로 중앙 */
  justify-content: center;
  /* 가로 중앙 */
  text-decoration: none !important;
  /* 밑줄 삭제 */
  font-size: 15px;
  /* 가독성 향상(옵션) */
  font-weight: 500;
  /* 가독성 향상(옵션) */
  cursor: pointer;
}

.words {
  color: #000;
  font-family: Inter;
  font-size: 48px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.96px;
  text-align: right;
  margin-top: 200px;
  margin-right: 150px;
}

.hot-place-text h2 {
  color: #000;
  font-family: Inter;
  font-size: 48px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.96px;
  margin-top: 350px;
}

.travel-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  /* 4열 */
  gap: 24px;
  justify-items: center;
  gap: 50px;
}

.travel-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  width: 300px;
  transition: transform 0.2s;
}

.travel-card:hover {
  transform: scale(1.05);
}

.travel-card img {
  width: 300px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.label {
  margin-top: 10px;
  font-size: 20px;
  color: #111;
}



.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  /* 반투명 검정 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.calendar-modal {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 480px;
  max-width: 90%;
}
</style>

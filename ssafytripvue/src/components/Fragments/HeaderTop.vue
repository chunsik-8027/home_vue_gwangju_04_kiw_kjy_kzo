<template>
  <div class="container">
    <router-link to="/" class="Saffylogo" style="text-decoration: none">
      <img src="@/assets/img/logo.png" alt="ssafy logo" />
      <div class="AI"><span class="AIBlue">AI</span><span class="Trip"> 싸피 여행</span></div>
    </router-link>
    <div class="items">
      <!-- ✅ AI 버튼: 상태 직접 변경 -->
      <button class="headerbutton" @click="showAiChat = true">
        <div class="text-wrapper">AI</div>
      </button>
      <!-- ✅ 챗봇 모달은 항상 여기서 관리 -->
      <ChatBotModal v-if="showAiChat" @close="showAiChat = false" />

      <router-link to="/customer-center" class="headerbutton">
        <div class="text-wrapper">고객센터</div>
      </router-link>
      <button class="headerbutton">
        <div class="text-wrapper">싸피 여행 소개</div>
      </button>
      <template v-if="store.isLoggedIn">
        <router-link to="/mypage" class="headerbutton">
          <div class="text-wrapper">마이페이지</div>
        </router-link>
        <button class="headerbutton" @click.prevent="logout">
          <div class="text-wrapper">로그아웃</div>
        </button>
      </template>
      <template v-else>
        <router-link to="/loginForm" class="headerbutton">
          <div class="text-wrapper">로그인</div>
        </router-link>
        <router-link to="/regist" class="headerbutton">
          <div class="text-wrapper">회원가입</div>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMemberStore } from '@/store/member'
import ChatBotModal from '@/components/ChatBotModal.vue' // 경로 맞게!

const store = useMemberStore()
const showAiChat = ref(false)

const logout = () => {
  store.logout()
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}

.AIBlue {
  color: #69d1f4;
  font-family: Inter;
  font-weight: bold;
}

.Trip {
  font-family: Inter;
  font-weight: bold;
}

.container .Saffylogo {
  height: 65px;
  display: flex;
}

.AI {
  text-align: center;
  margin: auto;
}

.container .img {
  width: auto;
  height: 100%;
}

.items {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.headerbutton {
  display: flex;
  gap: 10px;
  color: #000;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  width: 140px;
  height: 40px;
  align-items: center;
  background-color: white;
  border: none;
  border-radius: 8px;
}

.headerbutton:hover {
  background-color: #69d1f4;
  color: black;
}

.headerbutton:hover img {
  filter: brightness(0) invert(1);
}

.headerbutton:active {
  transform: scale(0.97);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
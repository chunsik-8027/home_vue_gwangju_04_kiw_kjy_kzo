<template>
  <HeaderTopVue />
  <div class="app-layout">
    <CustomerCenterNav @menu-change="handleMenuChange" />
    <div class="content-area">
      <component :is="currentComponent" />
    </div>
  </div>
  <ChatBotModal v-if="showAiChat" @close="showAiChat = false" />
</template>

<script setup>
import { ref, computed } from 'vue'
import HeaderTopVue from '@/components/Fragments/HeaderTop.vue'

import CustomerCenterNav from '@/customer/CustomerCenterNav.vue'
import CustomerCenterNoticeSet from '@/customer/CustomerCenterNoticeSet.vue'
import CustomerCenterQnA from '@/customer/CustomerCenterQnA.vue'
import CustomerCenterQuestion from '@/customer/CustomerCenterQuestion.vue'

const selectedMenu = ref('notice')

const handleMenuChange = (menuKey) => {
  selectedMenu.value = menuKey
}

const currentComponent = computed(() => {
  switch (selectedMenu.value) {
    case 'notice':
      return CustomerCenterNoticeSet
    case 'apply':
      return CustomerCenterQnA
    case 'question':
      return CustomerCenterQuestion
    default:
      return {
        template: `<div style="padding: 20px;">아직 준비되지 않은 메뉴입니다.</div>`,
      }
  }
})
</script>
<style scoped>
.app-layout {
  display: flex;
  align-items: flex-start;
  max-width: 1100px;
  margin: 0 auto;
  font-family: sans-serif;
}

.content-area {
  flex: 1;
  padding: 0;
  margin-left: 24px;
}

.notice-box {
  background-color: #e8f7fd;
  /* 밝은 하늘색 계열 */
  border: 1px solid #b3e5fc;
  /* 경계도 하늘색 계열 */
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notice-box:hover {
  background-color: #d0f0fc;
}

.reply-box {
  background-color: #f0fbff;
  border: 1px solid #b3e5fc;
  border-top: none;
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
}
</style>
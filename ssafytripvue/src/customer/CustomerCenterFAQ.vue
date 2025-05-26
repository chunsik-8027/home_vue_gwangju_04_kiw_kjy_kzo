<template>
  <div class="faq-container">
    <h2>FAQ</h2>

    <div v-for="(item, index) in faqList" :key="index" class="faq-item">
      <div class="faq-question" @click="toggle(index)">
        <span class="q-label">Q</span>
        <span class="q-text">{{ item.question }}</span>
      </div>

      <transition name="fade-slide">
        <div v-if="openIndexes.includes(index)" class="faq-answer">
          <span class="a-label">A</span>
          <div class="a-text" v-html="item.answer"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const faqList = [
  {
    question: '여행 계획을 저장하려면 어떻게 해야 하나요?',
    answer: `
      상단의 [로그인] 버튼을 통해 계정에 로그인 후, <br/>
      여행 계획을 세우고 '저장' 버튼을 누르면 내 여행 플랜에 안전하게 저장됩니다.<br/>
      로그인하지 않은 상태에서는 임시 저장만 가능합니다.
    `,
  },
  {
    question: '로그아웃은 어디서 할 수 있나요?',
    answer: `
      우측 상단 [로그인/로그아웃] 메뉴에서 로그아웃할 수 있습니다.<br/>
      로그아웃 시 내 정보와 여행 계획은 더 이상 표시되지 않습니다.
    `,
  },
  {
    question: '여행 일정에 친구를 초대할 수 있나요?',
    answer: `
      여행 계획 저장 후, '친구 초대' 기능을 통해 카카오톡, 문자 등으로 함께 일정을 공유할 수 있습니다.<br/>
      단, 친구도 싸피 여행 서비스에 가입되어 있어야 합니다.
    `,
  },
  {
    question: '핫플 추천/할인 정보는 어디서 볼 수 있나요?',
    answer: `
      메인 화면에서 '핫플 여행지 둘러보기'와 '오늘의 할인' 영역을 확인해보세요.<br/>
      각 여행지 상세 페이지에서도 할인 혜택, 인기 코스, 실시간 리뷰를 볼 수 있습니다.
    `,
  },
  {
    question: '여행 플랜을 PDF로 다운로드하고 싶어요.',
    answer: `
      내 여행 계획 페이지 우측 상단의 [PDF 다운로드] 버튼을 클릭하면, 일정표를 한 번에 저장할 수 있습니다.<br/>
      공유도 간편하게 가능합니다.
    `,
  },
  {
    question: '계정 비밀번호를 잊어버렸어요.',
    answer: `
      로그인 화면에서 [비밀번호 찾기]를 클릭하여 이메일로 비밀번호 재설정을 진행하실 수 있습니다.
    `,
  },
]

const openIndexes = ref([])

const toggle = (index) => {
  const i = openIndexes.value.indexOf(index)
  if (i > -1) {
    openIndexes.value.splice(i, 1) // 이미 열려있으면 닫기
  } else {
    openIndexes.value.push(index) // 아니면 열기
  }
}
</script>

<style scoped>
.faq-container {
  width: 100%;
  margin: auto;
  font-family: 'Inter', sans-serif;
  margin-top: 24px;
  /* 여백 추가 */
}

h2 {
  font-size: 24px;
  margin-bottom: 18px;
  color: #222;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.faq-item {
  border: none;
  margin-bottom: 16px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(105, 209, 244, 0.1);
  /* 살짝 그림자 */
  background: #f7fcfe;
  transition: box-shadow 0.2s;
}

.faq-question {
  display: flex;
  align-items: flex-start;
  padding: 20px 22px;
  cursor: pointer;
  transition: background-color 0.18s;
  background: #e8f7fd;
}

.faq-question:hover {
  background: #d1effa;
}

.q-label {
  font-weight: bold;
  margin-right: 16px;
  color: #3db4e7;
  font-size: 20px;
  flex-shrink: 0;
}

.q-text {
  font-weight: 600;
  color: #111;
  font-size: 17px;
}

.faq-answer {
  background-color: #f7fcfe;
  padding: 18px 28px 20px 60px;
  font-size: 15px;
  color: #323232;
  line-height: 1.6;
  border-top: 1px solid #d8ecf4;
}

.a-label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #69d1f4;
}

.a-text {
  white-space: pre-line;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.45, 1.45, 0.68, 1.01);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

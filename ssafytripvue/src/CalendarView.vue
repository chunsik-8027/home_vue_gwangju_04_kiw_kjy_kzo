<template>
  <div class="wrapper">
    <div class="cancleButton">
      <button class="cancle" @click="$emit('close')">
        <img src="./assets/img/CancelButtonIcon.png" alt="cancle" class="cancleImg" />
      </button>
    </div>
    <div class="calendarDiv">
      <VDatePicker :attributes="attrs" borderless class="cal" v-model.range="range" />
    </div>
    <div class="nextPlanButton">
      <button class="button" @click="goToMyPlan">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const range = ref({
  start: new Date(),
  end: new Date(),
})

const goToMyPlan = () => {
  router.push('/MyPlan')
}

watch(range, (newRange) => {
  //// console.log('날짜 범위가 변경되었습니다:')
  // console.log('시작 날짜:', newRange.start)
  // console.log('종료 날짜:', newRange.end)
  const { start, end } = newRange
  if (!start || !end) return

  const current = new Date(start)
  const endDate = new Date(end)

  const dateList = []

  while (current <= endDate) {
    const month = current.getMonth() + 1
    const day = current.getDate()
    dateList.push(`${month}.${day}`)

    // 하루 증가
    current.setDate(current.getDate() + 1)
  }

  console.log('선택한 날짜 리스트:', dateList)
})

const attrs = ref([
  {
    key: 'today',
    highlight: true,
    dates: new Date(),
  },
])
</script>

<style scoped>
body {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper {
  width: 480px;
  height: 450px;
  display: block;
  align-items: center;
  position: relative;
  justify-content: space-between;
  border-radius: 10px;
}

.calendarDiv {
  width: 100%;
  height: 330px;
  max-width: 330px;
  margin-left: 80px;
  margin-right: 10px;
  padding-left: 30px;
}

.cancleImg {
  width: 30px;
  height: 30px;
}

.cancleImg:active {
  transform: scale(0.9); /* 작아짐 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3); /* 눌린 듯한 그림자 */
}

.cancle {
  background: none;
  border: none;
  cursor: pointer;
  /* padding: 4px 10px; */
}

.cancleButton {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 30px;
  padding-bottom: 20px;
  padding-top: 10px;
}

.button {
  width: 65px;
  height: 35px;
  border-radius: 10px;
  border: none;
}

.nextPlanButton {
  display: flex;
  justify-content: flex-end;
}

.button:active {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.vc-pane {
  max-width: 100% !important;
}

.vc-day {
  min-width: 44px !important;
  min-height: 44px !important;
}
</style>

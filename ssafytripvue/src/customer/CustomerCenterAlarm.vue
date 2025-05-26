<template>
  <div class="check-point-box">
    <h3>Check Point</h3>
    <p>
      <span class="check-icon">✔</span>
      여행 계획을 세우기 전, 로그인 후 내 여행 플랜을 저장하세요.
    </p>
    <p>
      <span class="check-icon">✔</span>
      비상 연락처, 보험 등 안전 정보는 미리 챙겨두면 더 안심할 수 있어요.
    </p>
    <p>
      <span class="check-icon">✔</span>
      인기 여행지의 숙소, 교통편은 미리 예약해야 원하는 일정대로 움직일 수 있습니다.
    </p>
    <p>
      <span class="check-icon">✔</span>
      여행 할인 혜택과 추천 루트, 오늘의 핫플도 꼭 확인하세요!
    </p>
  </div>
</template>

<script setup></script>
<style scoped>
.check-point-box {
  background-color: #f0fbff;
  /* 연한 하늘색 */
  border-left: 4px solid #69d1f4;
  /* 브랜드 하늘색 */
  padding: 16px 20px;
  margin-top: 5%;
  font-family: 'Inter', sans-serif;
  width: 100%;
}

h3 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #222;
  font-weight: bold;
}

p {
  font-size: 14px;
  color: #444;
  display: flex;
  align-items: flex-start;
  line-height: 1.6;
}

.check-icon {
  margin-right: 8px;
  font-size: 16px;
  color: #69d1f4;
  /* 브랜드 하늘색으로 변경 */
  line-height: 1.5;
}
</style>

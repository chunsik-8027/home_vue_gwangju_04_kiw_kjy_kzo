<template>
  <div class="Title-box">
    <button class="Title"><img src="./assets/img/TitleIcon.png" /><span>Title 검색</span></button>
  </div>
</template>

<script setup></script>

<style scoped>
.Title img {
  width: 20px;
  height: 20px;
}

.Title {
  display: flex;
  gap: 10px;
  color: #000;
  font-family: Inter;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 33px */
  width: 140px;
  height: 40px;
  align-items: center;
  background-color: white;
  border: none;
  border-radius: 8px;
}

.Title:hover {
  background-color: #69d1f4;
  color: black;
}

.Title:hover img {
  filter: brightness(0) invert(1); /* 이미지 색상 반전 */
}

.Title:active {
  transform: scale(0.97); /* 약간 줄여서 눌린 듯한 효과 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3); /* 안쪽 그림자 */
}
</style>

<template>
  <div>
    <button>Next</button>
  </div>
</template>

<script setup></script>

<style scoped>
button {
  height: 50px;
  width: 100px;
  background-color: black;
  color: white;
  font-weight: bold;
  border-radius: 8px;
}

button:hover {
  background-color: #69d1f4;
  color: white;
}

button:active {
  transform: scale(0.97); /* 약간 줄여서 눌린 듯한 효과 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3); /* 안쪽 그림자 */
}
</style>

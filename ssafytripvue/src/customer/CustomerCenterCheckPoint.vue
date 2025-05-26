<template>
  <div class="check-point-box2">
    <h3>Check Point</h3>
    <p>
      <span class="check-icon2">✔</span>
      꼭 체크하세요! (여기에 원하는 안내문 넣으세요)
    </p>
  </div>
</template>

<script setup></script>
<style scoped>
.check-point-box {
  background-color: #f7fcfe;
  border-left: 4px solid #69d1f4;
  padding: 18px 24px;
  margin-top: 18px;
  font-family: 'Inter', sans-serif;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(105, 209, 244, 0.07);
}

h3 {
  margin: 0 0 10px;
  font-size: 17px;
  color: #2079b0;
  font-weight: 700;
  letter-spacing: -0.4px;
}

p {
  font-size: 15px;
  color: #444;
  display: flex;
  align-items: flex-start;
  line-height: 1.65;
}

.check-icon {
  margin-right: 8px;
  font-size: 17px;
  color: #69d1f4;
  line-height: 1.5;
}
</style>

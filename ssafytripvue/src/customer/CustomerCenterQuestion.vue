<template>
  <div class="question-mail-form">
    <h2>질문하기 <span class="subtitle">(이메일 문의)</span></h2>
    <form @submit.prevent="onSubmit" class="mail-form">
      <input v-model="email" placeholder="이메일" required />
      <input v-model="title" placeholder="제목" required />
      <textarea v-model="content" placeholder="질문 내용을 입력하세요" required />
      <button type="submit">질문 메일 보내기</button>
    </form>
    <div v-if="success" class="success-msg">메일이 전송되었습니다!</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
const title = ref('')
const content = ref('')
const email = ref('')
const success = ref(false)

const onSubmit = async () => {
  await axios.post('/api/question-mail', {
    email: email.value,
    title: title.value,
    content: content.value,
  })
  success.value = true
  title.value = ''
  content.value = ''
  email.value = ''
}
</script>

<style scoped>
.question-mail-form {
  max-width: 520px;
  margin: 40px auto;
  background: #fafdff;
  border-radius: 18px;
  box-shadow: 0 2px 14px 0 rgba(105, 209, 244, 0.08);
  padding: 36px 32px 32px 32px;
}
h2 {
  font-size: 1.7rem;
  margin-bottom: 26px;
  font-weight: 700;
  color: #222;
}
.subtitle {
  font-size: 1rem;
  color: #69d1f4;
  margin-left: 7px;
  font-weight: 500;
}
.mail-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
input,
textarea {
  border: 1.5px solid #b7e8fb;
  border-radius: 9px;
  padding: 13px 14px;
  font-size: 1rem;
  font-family: inherit;
  transition: border 0.2s;
  background: #fff;
}
input:focus,
textarea:focus {
  outline: none;
  border-color: #69d1f4;
}
textarea {
  min-height: 92px;
  resize: vertical;
}
button {
  align-self: flex-end;
  background: linear-gradient(90deg, #69d1f4 60%, #43b5e6 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  padding: 11px 32px;
  margin-top: 8px;
  cursor: pointer;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.07);
  transition:
    background 0.18s,
    transform 0.13s;
}
button:hover {
  background: linear-gradient(90deg, #43b5e6 60%, #69d1f4 100%);
  transform: translateY(-2px) scale(1.03);
}
.success-msg {
  color: #2079b0;
  font-weight: bold;
  margin-top: 22px;
  text-align: center;
  font-size: 1.1rem;
}
</style>
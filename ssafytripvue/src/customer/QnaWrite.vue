<template>
  <div class="qna-write" style="background: #fafdff; padding: 30px 24px; border-radius: 12px">
    <button @click="$emit('back')" style="
        background: #73cfff;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 20px;
        margin-bottom: 18px;
      ">
      목록으로
    </button>
    <h2 style="margin-bottom: 18px">새 글 작성</h2>
    <div style="margin-bottom: 10px">
      <input v-model="title" placeholder="제목"
        style="width: 100%; padding: 8px; border-radius: 7px; border: 1px solid #cce5ff" />
    </div>
    <div style="margin-bottom: 18px">
      <textarea v-model="content" rows="6" placeholder="내용"
        style="width: 100%; padding: 8px; border-radius: 7px; border: 1px solid #cce5ff"></textarea>
    </div>
    <button @click="submit"
      style="background: #00b8ff; color: white; border: none; border-radius: 7px; padding: 8px 23px">
      등록
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useMemberStore } from '@/store/member'

const store = useMemberStore()

const title = ref('')
const content = ref('')

const emit = defineEmits(['back'])

const submit = async () => {
  if (!title.value.trim() || !content.value.trim()) return
  await axios.post('/api/qna', {
    mid: store.loginUser.mno, // 실제 로그인 사용자 PK로 교체!
    title: title.value,
    content: content.value,
  })
  emit('back')
}
</script>

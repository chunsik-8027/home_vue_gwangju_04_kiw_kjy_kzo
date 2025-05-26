<template>
  <div class="qna-detail" style="background: #fafdff; padding: 30px 24px; border-radius: 12px">
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
    <h2 style="margin-bottom: 8px">{{ qna.title }}</h2>
    <div style="margin-bottom: 18px">
      작성자:
      <span v-if="authorNickname">{{ authorNickname }}</span>
      <span v-else>{{ authorName }}</span>
      | {{ qna.date && qna.date.slice(0, 10) }}
    </div>
    <div style="margin-bottom: 22px">{{ qna.content }}</div>
    <hr />

    <div style="margin-top: 28px">
      <h3 style="margin-bottom: 8px">댓글</h3>
      <div v-if="comments.length === 0" style="color: #aaa">댓글이 없습니다.</div>
      <div v-for="c in comments" :key="c.cid" style="margin: 6px 0 6px 10px">
        {{ c.content }}
      </div>
      <div v-if="store.loginUser.name" style="margin-top: 12px; display: flex; gap: 8px">
        <input v-model="newComment" placeholder="댓글 입력" @keyup.enter="submitComment"
          style="flex: 1; padding: 8px; border-radius: 7px; border: 1px solid #cce5ff" />
        <button @click="submitComment" style="
            background: #00b8ff;
            color: white;
            border: none;
            border-radius: 7px;
            padding: 7px 18px;
          ">
          등록
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { api } from '@/axios'
import { useMemberStore } from '@/store/member'

const store = useMemberStore()

const props = defineProps({
  qna: Object,
})

const comments = ref([])
const newComment = ref('')
const authorName = ref('')
const authorNickname = ref('')

// 댓글 불러오기 함수
const fetchComments = async () => {
  if (!props.qna) return
  const res = await api.get(`/api/qna-comment/${props.qna.no}`)
  comments.value = res.data
}

// 작성자 정보 불러오기 함수
const fetchAuthor = async () => {
  if (!props.qna?.mid) return
  try {
    const res = await api.get(`/api/users/id/${props.qna.mid}`)
    authorName.value = res.data.name || ''
    authorNickname.value = res.data.nickname || ''
  } catch (e) {
    authorName.value = '(알 수 없음)'
    authorNickname.value = ''
  }
}

// qna가 바뀔 때마다 댓글+작성자 새로
watch(
  () => props.qna,
  () => {
    fetchComments()
    fetchAuthor()
  },
  { immediate: true },
)

// 댓글 등록
const submitComment = async () => {
  if (!newComment.value.trim()) return
  await api.post('/api/qna-comment', {
    qna_id: props.qna.no,
    mid: store.loginUser.mno, // 실제 로그인 사용자 PK로 교체!
    content: newComment.value,
  })
  await fetchComments()
  newComment.value = ''
}
</script>

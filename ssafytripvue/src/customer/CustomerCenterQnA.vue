<template>
  <div>
    <!-- QnA 목록 -->
    <div v-if="view === 'list'" class="qna-list-page">
      <div class="qna-list-header">
        <h2>QnA 게시판</h2>
        <div v-if="store.loginUser.name">
          <button class="qna-write-btn" @click="showWrite">+ 새 글 작성</button>
        </div>
      </div>
      <div v-if="qnaList.length === 0" class="empty-msg">아직 작성된 게시글이 없습니다.</div>
      <div v-for="qna in qnaList" :key="qna.no" class="qna-list-item" @click="showDetail(qna)">
        <div class="title-row">
          <span class="qna-title">{{ qna.title }}</span>
        </div>
        <div class="meta-row">
          <span class="qna-author">
            {{ memberMap[qna.mid]?.nickname || memberMap[qna.mid]?.name || qna.mid }}
          </span>
          <span class="qna-date">{{ qna.date && qna.date.slice(0, 10) }}</span>
        </div>
      </div>
    </div>

    <!-- QnA 상세 -->
    <QnaDetail v-if="view === 'detail'" :qna="selectedQna" @back="backToList" />

    <!-- 글쓰기 -->
    <QnaWrite v-if="view === 'write'" @back="backToList" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import QnaDetail from './QnaDetail.vue'
import QnaWrite from './QnaWrite.vue'
import { useMemberStore } from '@/store/member'

const store = useMemberStore()

const qnaList = ref([])
const memberMap = ref({}) // {mid: member 객체}
const selectedQna = ref(null)
const view = ref('list') // 'list' | 'detail' | 'write'

// QnA 목록 불러오기 + 회원정보 동기화
const fetchQnaList = async () => {
  const res = await axios.get('/api/qna')
  qnaList.value = res.data

  // 중복 없는 mid 리스트
  const mids = [...new Set(res.data.map((q) => q.mid))]
  for (const mid of mids) {
    if (!memberMap.value[mid]) {
      try {
        const memRes = await axios.get(`/api/users/id/${mid}`)
        memberMap.value[mid] = memRes.data
      } catch (e) {
        memberMap.value[mid] = null
      }
    }
  }
}

onMounted(() => {
  fetchQnaList()
})

const showDetail = (qna) => {
  selectedQna.value = qna
  view.value = 'detail'
}

const showWrite = () => {
  view.value = 'write'
}

const backToList = () => {
  selectedQna.value = null
  view.value = 'list'
  fetchQnaList()
}
</script>

<style scoped>
.qna-list-area {
  /* 흰배경 & 카드가 컬러감 있게 좌우촥촥 */
  width: 100%;
  background: #fff;
  padding: 0;
}

.qna-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  margin-top: 5px;
  padding-left: 0px;
  padding-right: 0px;
}

h2 {
  font-size: 1.45rem;
  color: #168ad8;
  font-weight: 900;
  margin: 0 0 0 2px;
  letter-spacing: -0.8px;
}

.qna-write-btn {
  background: #69d1f4;
  color: #fff;
  font-size: 1.09rem;
  font-weight: 800;
  border: none;
  border-radius: 14px;
  padding: 12px 36px;
  cursor: pointer;
  box-shadow: 0 2px 9px 0 rgba(105, 209, 244, 0.12);
  transition:
    background 0.15s,
    transform 0.13s;
}

.qna-write-btn:hover {
  background: #43b5e6;
  transform: translateY(-1px) scale(1.035);
}

.qna-list-item {
  width: 100%;
  background: #e8f7fd;
  border-radius: 20px;
  padding: 28px 38px 23px 38px;
  margin-bottom: 22px;
  margin-left: 0;
  margin-right: 0;
  box-shadow: 0 4px 24px 0 rgba(105, 209, 244, 0.12);
  cursor: pointer;
  border: none;
  display: flex;
  flex-direction: column;
  transition:
    background 0.17s,
    box-shadow 0.13s,
    transform 0.12s;
}

.qna-list-item:hover {
  background: #d0f0fc;
  box-shadow: 0 8px 36px 0 rgba(105, 209, 244, 0.19);
  transform: translateY(-1px) scale(1.011);
}

.qna-title-row {
  font-size: 1.17rem;
  font-weight: 900;
  margin-bottom: 10px;
  color: #04b2f7;
  letter-spacing: -0.6px;
}

.qna-meta-row {
  display: flex;
  gap: 24px;
  font-size: 1.04rem;
  color: #2196bf;
  font-weight: 600;
}

.qna-author {
  color: #2292e9;
  font-weight: 800;
}

.qna-date {
  color: #6cb7cf;
  font-size: 1.01rem;
  font-weight: 500;
}

.empty-msg {
  text-align: center;
  color: #b6d0e3;
  margin: 54px 0 28px 0;
  font-size: 1.16rem;
  font-weight: 600;
}
</style>

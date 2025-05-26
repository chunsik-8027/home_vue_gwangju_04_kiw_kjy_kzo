<template>
  <div class="hotplace-card">
    <!-- 이미지 영역 -->
    <div class="image-box">
      <img :src="place.img || 'https://source.unsplash.com/random/300x200'" alt="hotplace"
        @click="emit('openModal', place)" />

      <!-- 좋아요 버튼 -->
      <button class="like-button" @click.stop="toggleLike">
        <span v-if="liked">❤</span>
        <span v-else>♡</span>
      </button>
    </div>

    <!-- 정보 영역 -->
    <div class="info-box">
      <h3 class="title">{{ place.name }}</h3>
      <p class="location">{{ place.address || '위치정보 없음' }}</p>
      <div class="stats">
        <span class="info-box-like">❤</span> <span>{{ place.likes || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { api } from '@/axios'
import { useMemberStore } from '@/store/member'

const store = useMemberStore()
const props = defineProps({
  place: { type: Object, required: true },
  likedList: { type: Array, default: () => [] }
})
const emit = defineEmits(['openModal', 'addLike', 'removeLike'])

const place = props.place
const liked = computed(() => props.likedList.includes(place.ano))

async function toggleLike() {
  const mno = store.loginUser.mno
  const ano = place.ano

  try {
    const response = await api.post('/api/hotplaces/likes', { uid: mno, ano })
    place.likes = response.data.updatedLikes
    const wasLiked = liked.value
    if (!wasLiked) emit('addLike', ano)
    else emit('removeLike', ano)

    console.log('[좋아요 응답]', response.data)
  } catch (e) {
    console.error('좋아요 API 실패:', e)
  }
}
</script>

<style scoped>
/* ---------- 카드 전체 ---------- */
.hotplace-card {
  aspect-ratio: 3 / 4;
  /* 카드 비율 고정 */
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s;
}

.hotplace-card:hover {
  transform: translateY(-4px);
}

/* ---------- 이미지 영역 ---------- */
.image-box {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  /* 가로:세로 4:3 */
  overflow: hidden;
}

.info-box-like {
  color: red
}

.image-box img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 꽉 채우며 잘라냄 */
}

/* 배지 & 좋아요 */
.duration-label {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background: #3f51b5;
  color: #fff;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.like-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  background: #fff;
  border: none;
  border-radius: 50%;
  font-size: 1.2rem;
  color: #e53935;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* ---------- 텍스트 영역 ---------- */
.info-box {
  padding: 0.75rem 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.location,
.date {
  font-size: 0.85rem;
  color: #666;
}

.stats {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #444;
  display: flex;
  gap: 1rem;
}
</style>
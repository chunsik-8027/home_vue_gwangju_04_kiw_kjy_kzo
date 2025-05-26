<template>
  <div class="ai-modal-bg">
    <div class="ai-modal-window" :style="{ left: `${position.x}px`, top: `${position.y}px` }" @mousedown="startDrag"
      @touchstart="startDrag" ref="modalWindow">
      <button class="close-btn" @click="$emit('close')">&times;</button>
      <h2 style="margin-bottom: 20px">AI 챗봇</h2>
      <div class="chat-body">
        <div v-for="(msg, idx) in messages" :key="idx" :class="msg.role">
          <b v-if="msg.role === 'user'">나:</b>
          <b v-else>AI:</b>
          <span>{{ msg.content }}</span>
        </div>
      </div>
      <form class="chat-form" @submit.prevent="ask">
        <input v-model="prompt" placeholder="무엇이든 물어보세요!" required autocomplete="off" />
        <button>전송</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { api } from '@/axios'

const messages = ref([])
const prompt = ref('')

// 위치(드래그)
const position = ref({ x: 0, y: 0 })
const dragging = ref(false)
const offset = ref({ x: 0, y: 0 })
const modalWindow = ref(null)

function startDrag(e) {
  dragging.value = true
  let clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  let clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY

  const rect = modalWindow.value.getBoundingClientRect()
  offset.value = {
    x: clientX - rect.left,
    y: clientY - rect.top,
  }
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', endDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', endDrag)
}
function onDrag(e) {
  if (!dragging.value) return
  let clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX
  let clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY
  position.value.x = clientX - offset.value.x
  position.value.y = clientY - offset.value.y
}
function endDrag() {
  dragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', endDrag)
}
// 초기 위치 센터
onMounted(() => {
  const winW = window.innerWidth
  const winH = window.innerHeight
  position.value = {
    x: Math.round((winW - 400) / 2),
    y: Math.round((winH - 440) / 2),
  }
})
onBeforeUnmount(() => {
  endDrag()
})

const ask = async () => {
  if (!prompt.value.trim()) return
  messages.value.push({ role: 'user', content: prompt.value })
  const userInput = prompt.value
  prompt.value = ''
  try {
    const res = await api.post('/api/ai-chat', { prompt: userInput }, { timeout: 10000 })
    messages.value.push({ role: 'ai', content: res.data.answer })
  } catch {
    messages.value.push({ role: 'ai', content: 'AI 답변을 불러올 수 없습니다.' })
  }
}
</script>

<style scoped>
.ai-modal-bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(32, 70, 90, 0.07);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  pointer-events: none;
}

.ai-modal-window {
  background: #fff;
  width: 400px;
  min-height: 440px;
  border-radius: 22px;
  box-shadow: 0 2px 18px 0 rgba(105, 209, 244, 0.17);
  display: flex;
  flex-direction: column;
  position: absolute;
  padding: 28px 22px 20px 22px;
  left: 0;
  top: 0;
  user-select: none;
  cursor: grab;
  transition: box-shadow 0.15s;
  pointer-events: auto;
}

.ai-modal-window:active {
  cursor: grabbing;
  box-shadow: 0 6px 22px 0 rgba(105, 209, 244, 0.33);
}

.close-btn {
  position: absolute;
  top: 13px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  color: #9cd5ee;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 15px;
  background: #f7fdff;
  border-radius: 10px;
  padding: 10px;
  max-height: 350px;
  /* or 원하는 크기 (px, vh, etc) */
  min-height: 160px;
  /* 옵션: 최소 높이 지정 */
}

.user {
  text-align: right;
  margin-bottom: 8px;
  color: #2079b0;
}

.ai {
  text-align: left;
  margin-bottom: 10px;
  color: #1582c6;
}

.chat-form {
  display: flex;
  gap: 7px;
}

input {
  flex: 1;
  border-radius: 7px;
  border: 1.2px solid #b7e8fb;
  padding: 8px 11px;
}

button {
  background: #69d1f4;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 8px 15px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #43b5e6;
}
</style>
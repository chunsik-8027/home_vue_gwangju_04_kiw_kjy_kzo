<template>
  <header>
    <HeaderTop />
  </header>
  <div class="profile-view-container">
    <!-- 회원 정보 -->
    <h2 class="view-title">회원정보</h2>
    <div class="info-row">
      <label>이름</label>
      <span>{{ store.loginUser.name }}</span>
    </div>
    <div class="info-row">
      <label>이메일</label>
      <span>{{ store.loginUser.email }}</span>
    </div>
    <div class="delete-area">
      <button class="delete-btn" @click="deleteMember">회원 탈퇴</button>
    </div>

    <!-- 나의 일정 리스트 영역 -->
    <div class="my-trip-section">
      <h3 class="trip-title">나의 일정</h3>
      <div v-if="myTrips.length === 0" class="empty-trip">등록된 일정이 없습니다.</div>
      <div v-else>
        <div v-for="(trip, idx) in myTrips" :key="trip.id" class="trip-card">
          <img :src="trip.imgUrl" class="trip-thumb" :alt="trip.title + ' 이미지'" />
          <div class="trip-info">
            <div class="trip-row">
              <span class="trip-d-day">D-{{ trip.dDay }}</span>
              <span class="trip-name">{{ trip.title }}</span>
            </div>
            <div class="trip-date">{{ trip.start }} ~ {{ trip.end }}</div>
            <div class="trip-actions">
              <button class="edit-btn" @click="openEdit(trip)">수정</button>
              <button class="delete-btn" @click="deletePlan(trip.id)">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 플랜 수정 모달 -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h4>플랜 수정</h4>
        <form @submit.prevent="updatePlan">
          <div>
            <label>플랜명</label>
            <input v-model="editForm.name" type="text" required />
          </div>
          <div>
            <label>시작일</label>
            <input type="date" v-model="editForm.start" required />
          </div>
          <div>
            <label>종료일</label>
            <input type="date" v-model="editForm.end" required />
          </div>
          <div class="modal-btns">
            <button type="submit" class="edit-btn">저장</button>
            <button type="button" @click="closeEdit" class="delete-btn">취소</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/axios'
import { useMemberStore } from '@/store/member'
import HeaderTop from '@/components/Fragments/HeaderTop.vue'
import { useRouter } from 'vue-router'

const store = useMemberStore()
const router = useRouter()
const myTrips = ref([])

onMounted(() => {
  fetchTrips()
})

async function fetchTrips() {
  try {
    const { data } = await api.get(`/api/attractions/plans/userid/${store.loginUser.mno}`)
    myTrips.value = data.map((plan) => ({
      id: plan.pid,
      imgUrl: `https://picsum.photos/seed/${plan.pid}/300/200`,
      title: plan.name,
      dDay: calcDDay(plan.start),
      start: plan.start.split(' ')[0],
      end: plan.end.split(' ')[0],
      mno: plan.mno,
      details: plan.details || [],
    }))
  } catch (e) {
    alert('나의 일정 조회에 실패했습니다.')
  }
}

function calcDDay(start) {
  const startDate = new Date(start)
  const today = new Date()
  return Math.ceil((startDate - today) / (1000 * 60 * 60 * 24))
}

// 회원 삭제
const deleteMember = async () => {
  if (!store.loginUser.email) return
  if (!confirm('정말로 회원 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return
  try {
    await api.delete(`/api/users/${store.loginUser.email}`)
    alert('회원 탈퇴가 완료되었습니다.')
    store.logout()
    router.push('/')
  } catch (e) {
    alert('회원 탈퇴에 실패했습니다. 관리자에게 문의해주세요.')
  }
}

// 플랜 삭제
async function deletePlan(pid) {
  if (!confirm('정말로 이 플랜을 삭제하시겠습니까?')) return
  try {
    await api.delete(`/api/attractions/plans/${pid}`)
    alert('플랜이 삭제되었습니다.')
    fetchTrips()
  } catch (e) {
    alert('플랜 삭제에 실패했습니다.')
  }
}

// 수정 모달 관리
const showEditModal = ref(false)
const editForm = ref({
  id: null,
  mno: '',
  name: '',
  start: '',
  end: '',
  details: [],
})

function openEdit(trip) {
  showEditModal.value = true
  editForm.value = {
    id: trip.id,
    mno: trip.mno,
    name: trip.title,
    start: trip.start,
    end: trip.end,
    details: trip.details,
  }
}

function closeEdit() {
  showEditModal.value = false
}

// 저장(수정)
async function updatePlan() {
  try {
    const pid = editForm.value.id
    // yyyy-mm-dd 00:00:00으로 변환
    const startDate =
      editForm.value.start.length <= 10 ? editForm.value.start + ' 00:00:00' : editForm.value.start
    const endDate =
      editForm.value.end.length <= 10 ? editForm.value.end + ' 00:00:00' : editForm.value.end
    await api.put(`/api/attractions/plans/${pid}`, {
      mno: editForm.value.mno,
      name: editForm.value.name,
      start: startDate,
      end: endDate,
      details: editForm.value.details, // 원래 details 사용
    })
    alert('플랜이 수정되었습니다.')
    showEditModal.value = false
    fetchTrips()
  } catch (e) {
    alert('플랜 수정에 실패했습니다.')
  }
}
</script>

<style scoped>
.profile-view-container {
  max-width: 800px;
  margin: 40px auto;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px #dbeafe55;
  padding: 48px 60px 34px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.view-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 34px;
  letter-spacing: 1px;
  text-align: center;
  color: #51cfff;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
  font-size: 1.11em;
  width: 100%;
  justify-content: flex-start;
  color: #222;
}

.delete-area {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.delete-btn {
  background: #51cfff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 32px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.13s;
  box-shadow: 0 1px 6px 0 #fd8b9428;
}
.delete-btn:hover {
  background: #51cfff;
  transform: translateY(-1px) scale(1.04);
}

.my-trip-section {
  margin-top: 44px;
  border-top: 1.5px solid #e0e7ef;
  padding-top: 28px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.trip-title {
  font-size: 1.19rem;
  font-weight: 700;
  color: #22325b;
  margin-bottom: 22px;
  letter-spacing: -0.5px;
  text-align: left;
  width: 100%;
}

.empty-trip {
  color: #bbb;
  font-size: 1.05rem;
  text-align: center;
  padding: 18px 0 10px;
  width: 100%;
}

.trip-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px #e7eefd44;
  padding: 26px 34px;
  margin-bottom: 30px;
  gap: 28px;
  width: 100%;
  max-width: 600px;
  min-height: 120px;
  transition: box-shadow 0.16s;
  position: relative;
}

.trip-thumb {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 2px 10px #e0eaf5cc;
  background: #f4f8fc;
  flex-shrink: 0;
}

.trip-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  min-width: 0;
}

.trip-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 3px;
}

.trip-d-day {
  background: #222;
  color: #fff;
  font-size: 1.04em;
  font-weight: 700;
  padding: 2px 16px;
  border-radius: 16px;
  margin-right: 10px;
  letter-spacing: 0.5px;
}

.trip-name {
  font-size: 1.18em;
  font-weight: 800;
  color: #22325b;
  letter-spacing: 0.2px;
}

.trip-date {
  font-size: 1.01em;
  color: #22325bcc;
  margin-bottom: 2px;
  font-weight: 500;
}

.trip-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.edit-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 30px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.13s;
  box-shadow: 0 1px 6px 0 #dbeafe44;
}
.edit-btn:hover {
  background: #51cfff;
  color: #fff;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: #0006;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 40px #a5b4fc66;
  padding: 38px 40px 28px 40px;
  min-width: 340px;
  max-width: 96vw;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: stretch;
}
.modal-content h4 {
  margin-bottom: 16px;
  font-size: 1.23rem;
  font-weight: 800;
  text-align: center;
  letter-spacing: 1px;
  color: #51cfff;
}
.modal-content form > div {
  margin-bottom: 18px;
}
.modal-content label {
  display: block;
  font-weight: 700;
  margin-bottom: 7px;
  color: #22325b;
  font-size: 1.03em;
}
.modal-content input[type='text'],
.modal-content input[type='date'] {
  width: 100%;
  border: 1.3px solid #e0e7ef;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 1.06em;
  background: #f8fafc;
  transition: border 0.2s;
}
.modal-content input[type='text']:focus,
.modal-content input[type='date']:focus {
  border: 1.7px solid #51cfff;
  outline: none;
  background: #e7f8fc;
}
.modal-btns {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 22px;
}
.modal-content .edit-btn {
  background: #2563eb;
  color: #fff;
  padding: 10px 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.05rem;
  border: none;
  cursor: pointer;
  transition: background 0.13s;
  box-shadow: 0 1px 6px 0 #dbeafe44;
}
.modal-content .edit-btn:hover {
  background: #51cfff;
}
.modal-content .delete-btn {
  background: #51cfff;
  color: #fff;
  padding: 10px 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.05rem;
  border: none;
  cursor: pointer;
  transition: background 0.13s;
  box-shadow: 0 1px 6px 0 #fd8b9428;
}
.modal-content .delete-btn:hover {
  background: #51cfff;
}

@media (max-width: 900px) {
  .profile-view-container {
    max-width: 99vw;
    padding: 26px 2vw 20px 2vw;
  }
  .trip-card {
    max-width: 100vw;
    padding: 14px 3vw;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }
  .trip-thumb {
    width: 90px;
    height: 90px;
  }
  .modal-content {
    min-width: 0;
    padding: 30px 8vw 22px 8vw;
  }
}
</style>

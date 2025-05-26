<template>
  <header>
    <HeaderTop />
  </header>
  <div class="signup-container">
    <div class="signup-box">
      <h2 class="signup-title">회원가입</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" id="name" v-model="form.name" required placeholder="이름을 입력하세요" />
        </div>
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model="form.email" required placeholder="이메일 주소를 입력하세요" />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="form.password" required placeholder="비밀번호를 입력하세요" />
        </div>
        <div class="form-group">
          <label for="address">주소</label>
          <div style="display: flex; gap: 8px; width: 100%;">
            <input type="text" id="address" v-model="form.address" required placeholder="주소를 검색하세요" readonly
              style="flex:1" />
            <button type="button" class="search-address-btn" @click="openPostcode">
              주소검색
            </button>
          </div>
        </div>
        <button class="signup-button" type="submit">가입하기</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import HeaderTop from '@/components/Fragments/HeaderTop.vue'
import { ref, onMounted } from 'vue'
import { api } from '@/axios'
import { useRouter } from 'vue-router'
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  address: '',
})

const error = ref('')
const success = ref(false)


onMounted(() => {
  if (!window.daum || !window.daum.Postcode) {
    const script = document.createElement('script')
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    document.body.appendChild(script)
  }
})


const openPostcode = () => {
  if (!window.daum || !window.daum.Postcode) {
    return
  }
  new window.daum.Postcode({
    oncomplete: function (data) {
      form.value.address = data.roadAddress || data.jibunAddress || ''
    }
  }).open()
}

const handleSubmit = async () => {
  error.value = ''
  success.value = false
  if (!form.value.name || !form.value.email || !form.value.password || !form.value.address) {
    error.value = '모든 항목을 입력하세요.'
    return
  }
  try {
    await api.post('/api/users', form.value)

    success.value = true
    alert('회원가입이 완료되었습니다!')
    router.push('/')
  } catch (e) {
    alert('회원가입에 실패했습니다. 다시 시도해 주세요.')
    console.log(e)
    router.push("/regist")
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #fff;
  width: 100vw;
}

.signup-box {
  background: #f8fcff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(90, 170, 230, 0.13);
  padding: 60px 72px 44px 72px;
  min-width: 500px;
  /* 폼 최소 넓이 */
  max-width: 600px;
  /* 폼 최대 넓이 (1200px 너무 넓으면 중간 느낌) */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.25rem;
}

.signup-title {
  color: #50cfff;
  font-size: 2.3rem;
  margin-bottom: 38px;
  font-weight: bold;
  letter-spacing: 2px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 30px;
  width: 100%;
  font-size: 1.19rem;
}

label {
  font-size: 1.14rem;
  font-weight: 500;
  color: #434c51;
  margin-bottom: 10px;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 17px 20px;
  border-radius: 8px;
  border: 1.8px solid #e3e7ee;
  background: #f6fbff;
  font-size: 1.15rem;
  margin-bottom: 10px;
  transition: border 0.2s;
}

input:focus {
  border: 1.8px solid #50cfff;
  outline: none;
}

.signup-button {
  background: #50cfff;
  color: #fff;
  font-size: 1.22rem;
  padding: 19px 0;
  border: none;
  border-radius: 9px;
  width: 100%;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: 22px;
  cursor: pointer;
  transition: background 0.2s;
}

.signup-button:hover {
  background: #32b5e4;
}

.search-address-btn {
  background: #50cfff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-weight: 500;
  font-size: 1.11rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .signup-box {
    min-width: 96vw;
    max-width: 98vw;
    padding: 22px 3vw;
  }

  .signup-title {
    font-size: 1.4rem;
  }
}

.error-message {
  margin-top: 16px;
  color: #f34a4a;
  font-size: 1rem;
  font-weight: 500;
}

.success-message {
  margin-top: 16px;
  color: #40b27a;
  font-size: 1rem;
  font-weight: 500;
}
</style>

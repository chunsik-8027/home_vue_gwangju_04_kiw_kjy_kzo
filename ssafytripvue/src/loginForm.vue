<template>
    <div class="login-container">
        <div class="login-box">
            <img :src="ssafylogo" alt="싸피 로고" class="logo" />
            <p class="subtitle">여행의 시작은 싸피</p>

            <div class="form-group">
                <input type="text" placeholder="이메일" class="input" v-model="member.email" />
                <input type="password" placeholder="비밀번호" class="input" v-model="member.password" />
                <button type="submit" class="login-button" @click.prevent="login">로그인</button>
            </div>

            <p class="signup-text">
                아직 회원이 아니신가요?
                <router-link to="/regist">
                    <div class="signup-link">회원가입</div>
                </router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import ssafylogo from "@/assets/img/ssafylogo.jpg";
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMemberStore } from '@/store/member'

const router = useRouter()
const member = ref({
    email: localStorage.getItem('email'),
})
const memberStore = useMemberStore()
const login = async () => {
    try {
        await memberStore.login(member.value)
    } catch (e) {
        console.log(e)
        alert(e?.response?.data?.message)
    }
    router.push({ name: 'main' })
}

</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f3f3f3;
}

.login-box {
    background-color: #fff;
    padding: 3rem 4rem;
    /* 넉넉한 내부 여백 */
    width: 100%;
    max-width: 850px;
    height: 500px;
    /* 기존보다 크게 */
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.logo {
    width: 300px;
    margin: 0 auto 0.5rem;
}

.subtitle {
    font-size: 0.75rem;
    color: #888;
    margin-bottom: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.input {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.9rem;
    transition: border-color 0.3s;
}

.input:focus {
    outline: none;
    border-color: #339af0;
}

.login-button {
    background-color: #111827;
    color: #fff;
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
}

.login-button:hover {
    background-color: #228be6;
}

.signup-text {
    font-size: 0.85rem;
    margin-top: 1rem;
    color: #444;
}

.signup-link {
    color: #339af0;
    font-weight: 600;
    text-decoration: none;
}

.signup-link:hover {
    text-decoration: underline;
}
</style>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import { api } from '@/axios'
import { jwtDecode } from 'jwt-decode'

export const useMemberStore = defineStore(
  'member',
  () => {
    const _isLoggedIn = ref(false)
    const _loginUser = ref({})

    const isLoggedIn = computed(() => _isLoggedIn.value)
    const loginUser = computed(() => _loginUser.value)

    const login = async ({ email, password }) => {
      const response = await api({
        url: '/api/member/login',
        method: 'post',
        data: { email, password },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      _tokens.value = response.data.data
      _isLoggedIn.value = true
      const decoded = jwtDecode(_tokens.value.accessToken)
      _loginUser.value = {
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        mno: decoded.mno,
      }
      console.log('디코딩된 유저 정보:', _loginUser.value)
      console.log('accessToken:', _tokens.value.accessToken)
      console.log('refreshToken:', _tokens.value.refreshToken)

      resetTokenTime()
    }

    const logout = async () => {
      try {
        _tokens.value.accessToken = null
        await api({
          url: '/api/auth/logout',
          method: 'post',
          headers: {
            'Refresh-Token': _tokens.value.refreshToken,
          },
        })
      } finally {
        _loginUser.value = {}
        _isLoggedIn.value = false
        _tokens.value = {}
        router.push({ name: 'main' })
      }
    }

    const _tokens = ref({})
    const tokens = computed(() => _tokens.value)

    const refresh = async () => {
      _tokens.value.accessToken = null
      const response = await api({
        url: '/api/auth/refresh',
        method: 'post',
        headers: {
          'Refresh-Token': _tokens.value.refreshToken,
        },
      })
      _tokens.value = response.data.data
      resetTokenTime()
    }

    const tokenTime = ref(0)
    let intervalId
    const resetTokenTime = () => {
      window.clearInterval(intervalId)
      tokenTime.value = 0
      intervalId = setInterval(() => {
        tokenTime.value++
      }, 1000)
    }

    const tokenStatus = computed(() => {
      if (!_tokens.value.refreshToken) {
        window.clearInterval(intervalId)
        tokenTime.value = 0
        return '로그아웃 상태'
      }
      if (tokenTime.value > 120) {
        return 'refresh token 만료'
      } else if (tokenTime.value > 60) {
        return 'access token 만료'
      } else {
        return 'token 유효'
      }
    })

    return {
      isLoggedIn,
      loginUser,
      login,
      logout,
      _isLoggedIn,
      _loginUser,
      tokens,
      _tokens,
      refresh,
      tokenTime,
      tokenStatus,
    }
  },
  {
    persist: { storage: sessionStorage },
  },
)

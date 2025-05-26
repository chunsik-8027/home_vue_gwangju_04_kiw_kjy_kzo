// index.js
import axios from 'axios'
import { useMemberStore } from '@/store/member'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 1000,
})

api.interceptors.request.use(
  async (config) => {
    console.log('[요청 발신]: ', config.method, config.url, config.data)
    const memberStore = useMemberStore()

    if (memberStore.tokens?.accessToken) {
      config.headers['Authorization'] = `Bearer ${memberStore.tokens.accessToken}`
    }
    return config
  },
  (error) => {
    console.log('[요청 실패]: ', error)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    console.log('[응답 수신 1]: ', response.status, response.data)

    return response
  },
  async (error) => {
    console.log('[오류 수신 1]: ', error)

    if (error.status === 401 && error.response?.data.message === 'TOKEN_ERROR') {
      console.log('access tokens 만료')
      const originalRequest = error.config

      const memberStore = useMemberStore()
      try {
        await memberStore.refresh()
        return api(originalRequest)
      } catch (e) {
        console.log('refresh token 만료', e.name)
        alert('refresh까지 만료!! 로그아웃 합니다.')
        memberStore.logout()
      }
    }

    return Promise.reject(error)
  },
)

export { api }

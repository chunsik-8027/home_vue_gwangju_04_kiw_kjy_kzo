import { createRouter, createWebHistory } from 'vue-router'

import HotplaceView from '@/hotPlaceForm.vue'
import MainTrip from '@/MainTrip.vue'
import MyPlan from '@/MyPlan.vue'
import CustomerCenter from '@/views/CustomerCenter.vue'
import LoginForm from '@/loginForm.vue'
import MyPage from '@/views/member/MyPage.vue'
import RegistView from '@/views/member/RegistView.vue'
import PlanDetail from '@/PlanDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainTrip,
    },
    {
      path: '/hotplace',
      name: 'hotplace',
      component: HotplaceView,
    },
    {
      path: '/MyPlan',
      name: 'MyPlan',
      component: MyPlan,
    },
    {
      path: '/customer-center',
      name: 'CustomerCenter',
      component: CustomerCenter,
    },

    {
      path: '/loginForm',
      name: 'loginForm',
      component: LoginForm,
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPage,
    },
    {
      path: '/regist',
      name: 'regist',
      component: RegistView,
    },
    {
      path: '/PlanDetail',
      name: 'detail',
      component: PlanDetail,
    },
  ],
})

export default router

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(VCalendar, {})
app.mount('#app')

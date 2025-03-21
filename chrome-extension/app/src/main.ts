import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
  ],
})

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.mount('#app')

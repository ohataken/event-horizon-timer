import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './OptionsPageApp.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
  ],
})

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },  
})

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.use(vuetify)
app.mount('#app')

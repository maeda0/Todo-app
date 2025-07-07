import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' 
import './style.css'
import App from './App.vue'
import VCalendar from 'v-calendar'
import 'v-calendar/dist/style.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) 

app.use(pinia)
app.component('VCalendar', VCalendar);
app.use(VCalendar, {});
app.mount('#app')
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VCalendar, { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';

const app = createApp(App);

app.component('Calendar', Calendar);
app.component('DatePicker', DatePicker);
app.use(VCalendar, {});
app.mount('#app');

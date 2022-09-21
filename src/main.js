// 基本配置
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
// axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// pinia
import { createPinia } from 'pinia'
const pinia = createPinia()
const app = createApp(App)
app.use(ElementPlus,axios,VueAxios).use(pinia)
app.mount('#app')
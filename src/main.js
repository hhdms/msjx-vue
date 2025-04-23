import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import axios from 'axios'

// 配置axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api'
axios.defaults.timeout = 10000

// 配置请求拦截器
axios.interceptors.request.use(
  config => {
    // 从localStorage中获取token
    const token = localStorage.getItem('token')
    
    // 如果token存在，则添加到请求头
    if (token) {
      config.headers.token = token
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 配置响应拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        // 清除本地存储的token和用户信息
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        
        // 跳转到登录页
        router.push({
          path: '/login',
          query: {
            redirect: router.currentRoute.value.fullPath
          }
        })
      }
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用ElementPlus并设置中文语言
app.use(ElementPlus, {
  locale: zhCn
})

app.use(router)
app.mount('#app')

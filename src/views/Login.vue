<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <img src="../assets/images/login-illustration.jpg" alt="登录插图" class="login-image" />
      </div>
      <div class="login-right">
        <div class="login-header">
          <h2 class="login-title">墨水教学-教育管理系统</h2>
          <p class="login-subtitle">请使用员工账号登录系统</p>
        </div>
        
        <div class="login-form">
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top">
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="请输入用户名" 
                prefix-icon="User"
                clearable
                @keyup.enter="handleLogin"
              ></el-input>
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="请输入密码" 
                prefix-icon="Lock"
                show-password
                clearable
                @keyup.enter="handleLogin"
              ></el-input>
            </el-form-item>
            
            <div class="login-remember">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <a href="javascript:void(0)" class="forgot-password">忘记密码?</a>
            </div>
            
            <el-form-item>
              <el-button 
                type="primary" 
                class="login-button" 
                :loading="loading" 
                @click="handleLogin"
              >登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <div class="login-footer">
          <p>© 2023 墨水教学 教育管理系统 版权所有</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 检查是否有保存的登录信息
onMounted(() => {
  const savedUsername = localStorage.getItem('username')
  if (savedUsername) {
    loginForm.username = savedUsername
    rememberMe.value = true
  }
  
  // 如果已经登录了，直接跳转到首页
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/')
  }
})

// 处理登录逻辑
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    // 表单验证
    await loginFormRef.value.validate()
    
    loading.value = true
    
    // 修复API路径，移除/api前缀，因为axios.defaults.baseURL已设置为/api
    const response = await axios.post('/login', {
      username: loginForm.username,
      password: loginForm.password
    })
    
    // 处理登录成功
    if (response.data.code === 1) {
      ElMessage.success('登录成功')
      
      // 保存token到localStorage
      localStorage.setItem('token', response.data.data.token)
      
      // 记住用户名
      if (rememberMe.value) {
        localStorage.setItem('username', loginForm.username)
      } else {
        localStorage.removeItem('username')
      }
      
      // 保存用户信息
      localStorage.setItem('userInfo', JSON.stringify({
        id: response.data.data.id,
        username: response.data.data.username,
        name: response.data.data.name
      }))
      
      // 配置axios默认headers，所有请求自动带上token
      axios.defaults.headers.common['token'] = response.data.data.token
      
      // 检查是否有重定向URL
      const redirectPath = router.currentRoute.value.query.redirect
      if (redirectPath) {
        router.push(redirectPath)
      } else {
        // 没有重定向URL则跳转到首页
        router.push('/')
      }
      
    } else {
      // 处理登录失败
      ElMessage.error(response.data.msg || '登录失败')
    }
  } catch (error) {
    console.error('登录出错:', error)
    
    if (error.response) {
      ElMessage.error(error.response.data?.msg || `登录失败 (${error.response.status})`)
    } else {
      ElMessage.error('网络错误，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-box {
  display: flex;
  width: 900px;
  height: 560px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.login-left {
  flex: 1;
  background-color: #1890ff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-right {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.login-header {
  margin-bottom: 40px;
  text-align: center;
}

.login-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #666;
}

.login-form {
  flex: 1;
}

.login-remember {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-password {
  font-size: 14px;
  color: #1890ff;
  text-decoration: none;
}

.forgot-password:hover {
  color: #40a9ff;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.login-footer {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 24px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .login-box {
    width: 100%;
    height: auto;
    flex-direction: column;
  }
  
  .login-left {
    display: none;
  }
  
  .login-right {
    width: 100%;
    padding: 20px;
  }
}
</style> 
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/class',
    name: 'ClassManage',
    component: () => import('../views/ClassManage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/student',
    name: 'StudentManage',
    component: () => import('../views/StudentManage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/department',
    name: 'DepartmentManage',
    component: () => import('../views/DepartmentManage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/employee',
    name: 'EmployeeManage',
    component: () => import('../views/EmployeeManage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // 判断路由是否需要登录权限
  if (to.meta.requiresAuth !== false) {
    // 获取token
    const token = localStorage.getItem('token')
    
    if (token) {
      next() // 有token，放行
    } else {
      // 无token，重定向到登录页
      next({ 
        path: '/login',
        query: { redirect: to.fullPath } // 记录跳转前的路由，以便登录后重定向
      })
    }
  } else {
    // 不需要权限的页面直接放行
    next()
  }
})

export default router 
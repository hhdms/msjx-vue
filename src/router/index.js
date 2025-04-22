import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/class',
    name: 'ClassManage',
    component: () => import('../views/ClassManage.vue')
  },
  {
    path: '/student',
    name: 'StudentManage',
    component: () => import('../views/StudentManage.vue')
  },
  {
    path: '/department',
    name: 'DepartmentManage',
    component: () => import('../views/DepartmentManage.vue')
  },
  {
    path: '/employee',
    name: 'EmployeeManage',
    component: () => import('../views/EmployeeManage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
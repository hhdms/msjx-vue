<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { HomeFilled, User, School, UserFilled, Setting, OfficeBuilding, SwitchButton } from '@element-plus/icons-vue';

const route = useRoute();
const activeIndex = ref('/');
const openedMenu = ref('');
const userName = ref('');

// 计算属性：判断当前是否是登录页
const isLoginPage = computed(() => {
  return route.path === '/login';
});

const logout = () => {
  // 清除本地存储的token和用户信息
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  // 跳转到登录页
  window.location.href = '/login';
};

// 监听自定义事件，用于更新菜单状态
const handleMenuUpdate = (event) => {
  openedMenu.value = event.detail.menuIndex;
  activeIndex.value = event.detail.subIndex;
};

onMounted(() => {
  // 添加事件监听
  window.addEventListener('menu-update', handleMenuUpdate);
  
  // 获取登录用户信息
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  userName.value = userInfo.name || userInfo.username || '未登录用户';
});

onBeforeUnmount(() => {
  // 移除事件监听
  window.removeEventListener('menu-update', handleMenuUpdate);
});
</script>

<template>
  <!-- 登录页不显示系统布局 -->
  <div v-if="isLoginPage">
    <router-view />
  </div>
  
  <!-- 系统主页面布局 -->
  <div v-else class="app-container">
    <!-- 顶部标题栏 -->
    <header class="header">
      <h1 class="title">墨水教学-教育管理系统</h1>
      <div class="user-info">
        <span class="welcome-text">欢迎您，{{userName}}</span>
        <el-button type="text" @click="logout" class="logout-btn">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </header>
    
    <div class="main-container">
      <!-- 左侧菜单栏 -->
      <aside class="sidebar">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical"
          background-color="#f0f2f5"
          text-color="#303133"
          active-text-color="#409EFF"
          router
          :default-openeds="openedMenu ? [openedMenu] : []"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          
          <el-sub-menu index="2">
            <template #title>
              <el-icon><User /></el-icon>
              <span>班级学员管理</span>
            </template>
            <el-menu-item index="/class">
              <el-icon><School /></el-icon>
              <span>班级管理</span>
            </el-menu-item>
            <el-menu-item index="/student">
              <el-icon><UserFilled /></el-icon>
              <span>学员管理</span>
            </el-menu-item>
          </el-sub-menu>
          
          <!-- 系统信息管理主菜单 -->
          <el-sub-menu index="system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统信息管理</span>
            </template>
            
            <!-- 子菜单项 -->
            <el-menu-item index="/department">
              <el-icon><OfficeBuilding /></el-icon>
              <span>部门管理</span>
            </el-menu-item>
            <el-menu-item index="/employee">
              <el-icon><User /></el-icon>
              <span>员工管理</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </aside>
      
      <!-- 右侧内容区域 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: linear-gradient(90deg, #4b89dc 0%, #5d9cec 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-family: 楷体;
  font-size: 30px;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.welcome-text {
  font-size: 14px;
  color: white;
  margin-right: 10px;
}

.logout-btn {
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.logout-btn:hover {
  color: #f0f0f0;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
}

.sidebar {
  width: 220px;
  min-width: 220px;
  background-color: #f0f2f5;
  height: 100%;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.content {
  flex: 1;
  padding: 0;
  overflow-y: auto;
  background-color: #f5f7fa;
  width: calc(100% - 220px);
}
/* 图标间距调整 */
.el-menu-item .el-icon {
  margin-right: 8px;
  vertical-align: middle;
}

</style>

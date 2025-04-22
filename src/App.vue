<script setup>
import { ref } from 'vue';

const activeIndex = ref('/');

const logout = () => {
  // 退出登录逻辑
  console.log('退出登录');
};
</script>

<template>
  <div class="app-container">
    <!-- 顶部标题栏 -->
    <header class="header">
      <h1 class="title">墨水教学-教育管理系统</h1>
      <div class="user-info">
        <el-button type="text" @click="logout" class="logout-btn">退出登录【张三】</el-button>
      </div>
    </header>
    
    <div class="main-container">
      <!-- 左侧菜单栏 -->
      <aside class="sidebar">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#409EFF"
          router
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
            <el-menu-item index="/class">班级管理</el-menu-item>
            <el-menu-item index="/student">学员管理</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="3">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统信息管理</span>
            </template>
            <el-menu-item index="/department">部门管理</el-menu-item>
            <el-menu-item index="/employee">员工管理</el-menu-item>
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
  background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-family: 楷体;
  font-size: 30px;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.logout-btn {
  color: white;
  font-weight: 500;
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
  background-color: #304156;
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
</style>

<template>
  <div class="home-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <h1>墨水教学-教育管理系统</h1>
      <p class="welcome-text">高效管理教学资源，提升教育质量</p>
      <div class="current-time">{{ dateTimeStr }}</div>
    </div>

    <!-- 数据卡片区域 -->
    <div class="data-overview">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="data-card" shadow="hover">
            <el-icon class="card-icon"><School /></el-icon>
            <div class="card-body">
              <h2 class="card-value">10</h2>
              <p class="card-label">班级总数</p>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="data-card" shadow="hover">
            <el-icon class="card-icon"><User /></el-icon>
            <div class="card-body">
              <h2 class="card-value">256</h2>
              <p class="card-label">学员总数</p>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="data-card" shadow="hover">
            <el-icon class="card-icon"><OfficeBuilding /></el-icon>
            <div class="card-body">
              <h2 class="card-value">8</h2>
              <p class="card-label">部门总数</p>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="data-card" shadow="hover">
            <el-icon class="card-icon"><UserFilled /></el-icon>
            <div class="card-body">
              <h2 class="card-value">36</h2>
              <p class="card-label">员工总数</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 快速入口区域 -->
    <div class="quick-access">
      <el-card shadow="hover">
        <template #header>
          <div class="section-header">
            <span>快速入口</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :xs="12" :sm="6" :md="6" :lg="6" v-for="(item, index) in quickAccessList" :key="index">
            <div class="quick-access-item" @click="navigateTo(item)">
              <el-icon class="quick-icon"><component :is="item.icon" /></el-icon>
              <span class="quick-label">{{ item.name }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const dateTimeStr = ref('');
let timer = null;

// 更新时间的函数
const updateDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[now.getDay()];
  
  dateTimeStr.value = `${year}年${month}月${day}日 ${weekday} ${hours}:${minutes}:${seconds}`;
};

// 组件挂载时设置计时器
onMounted(() => {
  updateDateTime(); // 初始化时间
  timer = setInterval(updateDateTime, 1000); // 每秒更新一次
});

// 组件卸载前清除计时器
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});

// 快速入口列表
const quickAccessList = [
  { name: '班级管理', icon: 'School', path: '/class', menuIndex: '2', subIndex: '/class' },
  { name: '学员管理', icon: 'User', path: '/student', menuIndex: '2', subIndex: '/student' },
  { name: '部门管理', icon: 'OfficeBuilding', path: '/department', menuIndex: 'system', subIndex: '/department' },
  { name: '员工管理', icon: 'UserFilled', path: '/employee', menuIndex: 'system', subIndex: '/employee' }
];

// 导航函数 - 处理路由跳转和左侧菜单联动
const navigateTo = (item) => {
  // 导航到指定路由
  router.push(item.path);
  
  // 触发自定义事件，通知App.vue组件更新菜单选中状态
  const event = new CustomEvent('menu-update', { 
    detail: { 
      menuIndex: item.menuIndex,
      subIndex: item.subIndex
    } 
  });
  window.dispatchEvent(event);
};
</script>

<style scoped>
.home-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

/* 欢迎区域样式 */
.welcome-section {
  margin-bottom: 24px;
  padding: 30px;
  background: linear-gradient(135deg, #3a8ffe 0%, #2874f0 100%);
  border-radius: 12px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 20px rgba(58, 143, 254, 0.2);
  position: relative;
}

.welcome-section h1 {
  font-size: 32px;
  margin: 0;
  letter-spacing: 1px;
  font-weight: 600;
}

.welcome-text {
  font-size: 16px;
  margin-top: 10px;
  opacity: 0.9;
  letter-spacing: 0.5px;
}

.current-time {
  margin-top: 15px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
}

/* 数据卡片样式 */
.data-overview {
  margin-bottom: 24px;
}

.data-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 140px;
  margin-bottom: 20px;
  border-radius: 12px;
  transition: all 0.3s;
  overflow: visible;
  border: none;
  padding: 20px;
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 46px;
  margin-right: 24px;
  color: #409EFF;
  min-width: 46px;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.card-value {
  font-size: 40px;
  font-weight: 600;
  margin: 0;
  color: #303133;
  line-height: 1.2;
}

.card-label {
  font-size: 16px;
  color: #909399;
  margin: 8px 0 0 0;
  white-space: nowrap;
}

/* 快速入口样式 */
.quick-access {
  margin-bottom: 20px;
}

.section-header {
  font-weight: 600;
  font-size: 16px;
}

.quick-access-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  background-color: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
  text-decoration: none;
  color: #303133;
  transition: all 0.3s;
  cursor: pointer;
}

.quick-access-item:hover {
  background-color: #ecf5ff;
  transform: translateY(-3px);
}

.quick-icon {
  font-size: 32px;
  margin-bottom: 12px;
  color: #409EFF;
}

.quick-label {
  font-size: 16px;
}
</style> 
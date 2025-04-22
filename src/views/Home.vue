<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1>欢迎使用墨水教学-教育管理系统</h1>
      <p class="welcome-text">高效管理教学资源，提升教育质量</p>
    </div>
    <div class="dashboard">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="8">
          <el-card class="box-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span><el-icon class="icon"><School /></el-icon> 班级统计</span>
              </div>
            </template>
            <div class="card-content">
              <h2>10</h2>
              <p>班级总数</p>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-card class="box-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span><el-icon class="icon"><User /></el-icon> 学员统计</span>
              </div>
            </template>
            <div class="card-content">
              <h2>256</h2>
              <p>学员总数</p>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-card class="box-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span><el-icon class="icon"><UserFilled /></el-icon> 教职工统计</span>
              </div>
            </template>
            <div class="card-content">
              <h2>36</h2>
              <p>教职工人数</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
// 首页逻辑
</script>

<style scoped>
.home-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.welcome-section {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(to right, #e0eafc, #cfdef3);
  border-radius: 8px;
  text-align: center;
}

.welcome-text {
  color: #666;
  font-size: 16px;
  margin-top: 10px;
}

.dashboard {
  margin-top: 30px;
}

.box-card {
  margin-bottom: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.box-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.icon {
  margin-right: 8px;
}

.card-content {
  text-align: center;
  padding: 20px 0;
}

.card-content h2 {
  font-size: 36px;
  color: #409EFF;
  margin: 0;
}

.card-content p {
  margin-top: 10px;
  color: #999;
}
</style> 
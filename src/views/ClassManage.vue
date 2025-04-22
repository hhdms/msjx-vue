<template>
  <div class="class-manage-container">
    <div class="page-header">
      <h1>班级管理</h1>
      <p class="page-description">管理学校的所有班级信息</p>
    </div>
    <div class="class-content">
      <el-card shadow="hover" class="table-card">
        <template #header>
          <div class="operation-header">
            <el-button type="primary" @click="handleAddClass">
              <el-icon><Plus /></el-icon>新增班级
            </el-button>
          </div>
        </template>
        <el-table :data="classData" border style="width: 100%" stripe>
          <el-table-column prop="id" label="班级ID" width="80" align="center" />
          <el-table-column prop="name" label="班级名称" width="180" />
          <el-table-column prop="teacher" label="班主任" width="120" align="center" />
          <el-table-column prop="studentsCount" label="学员数量" width="100" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column label="操作" width="180" align="center">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 班级数据
const classData = ref([
  {
    id: 1,
    name: '初一(1)班',
    teacher: '王老师',
    studentsCount: 45,
    createTime: '2023-09-01'
  },
  {
    id: 2,
    name: '初一(2)班',
    teacher: '李老师',
    studentsCount: 42,
    createTime: '2023-09-01'
  },
  {
    id: 3,
    name: '初二(1)班',
    teacher: '张老师',
    studentsCount: 48,
    createTime: '2022-09-01'
  }
]);

// 添加班级
const handleAddClass = () => {
  console.log('添加班级');
};

// 编辑班级
const handleEdit = (row) => {
  console.log('编辑班级', row);
};

// 删除班级
const handleDelete = (row) => {
  console.log('删除班级', row);
};
</script>

<style scoped>
.class-manage-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 20px;
  background: linear-gradient(to right, #e0f7fa, #b2ebf2);
  padding: 15px;
  border-radius: 8px;
}

.page-description {
  color: #666;
  margin-top: 5px;
}

.class-content {
  margin-top: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.operation-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style> 
<template>
  <div class="department-manage-container">
    <div class="page-header">
      <h1>部门管理</h1>
      <p class="page-description">管理学校各个职能部门信息</p>
    </div>
    <div class="department-content">
      <el-card shadow="hover" class="table-card">
        <template #header>
          <div class="operation-header">
            <el-button type="primary" @click="handleAddDepartment">
              <el-icon><Plus /></el-icon>新增部门
            </el-button>
          </div>
        </template>
        <el-table :data="departmentData" border style="width: 100%" stripe>
          <el-table-column prop="id" label="序号" width="80" align="center" />
          <el-table-column prop="name" label="部门名称" width="180" />
          <el-table-column prop="manager" label="负责人" width="120" align="center" />
          <el-table-column prop="employeeCount" label="员工数量" width="100" align="center" />
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

// 部门数据
const departmentData = ref([
  {
    id: 1,
    name: '学工部',
    manager: '张主任',
    employeeCount: 12,
    createTime: '2023-01-01'
  },
  {
    id: 2,
    name: '教研部',
    manager: '李主任',
    employeeCount: 16,
    createTime: '2023-01-01'
  },
  {
    id: 3,
    name: '行政部',
    manager: '王主任',
    employeeCount: 8,
    createTime: '2023-01-01'
  }
]);

// 添加部门
const handleAddDepartment = () => {
  console.log('添加部门');
};

// 编辑部门
const handleEdit = (row) => {
  console.log('编辑部门', row);
};

// 删除部门
const handleDelete = (row) => {
  console.log('删除部门', row);
};
</script>

<style scoped>
.department-manage-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 20px;
  background: linear-gradient(to right, #fff8e1, #ffecb3);
  padding: 15px;
  border-radius: 8px;
}

.page-description {
  color: #666;
  margin-top: 5px;
}

.department-content {
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
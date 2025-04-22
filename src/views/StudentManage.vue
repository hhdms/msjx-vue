<template>
  <div class="student-manage-container">
    <div class="page-header">
      <h1>学员管理</h1>
      <p class="page-description">管理所有学员的基本信息</p>
    </div>
    <div class="student-content">
      <el-card shadow="hover" class="table-card">
        <template #header>
          <div class="operation-header">
            <div class="search-box">
              <el-input
                v-model="searchText"
                placeholder="请输入学员姓名或学号"
                class="search-input"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </div>
            <el-button type="primary" @click="handleAddStudent">
              <el-icon><Plus /></el-icon>新增学员
            </el-button>
          </div>
        </template>
        <el-table :data="studentData" border style="width: 100%" stripe>
          <el-table-column prop="id" label="学号" width="80" align="center" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="gender" label="性别" width="80" align="center" />
          <el-table-column prop="age" label="年龄" width="80" align="center" />
          <el-table-column prop="className" label="所属班级" width="150" />
          <el-table-column prop="phone" label="联系电话" width="150" align="center" />
          <el-table-column prop="address" label="家庭住址" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 搜索文本
const searchText = ref('');

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 学员数据
const studentData = ref([
  {
    id: '2023001',
    name: '张三',
    gender: '男',
    age: 15,
    className: '初一(1)班',
    phone: '13800138000',
    address: '北京市朝阳区'
  },
  {
    id: '2023002',
    name: '李四',
    gender: '女',
    age: 14,
    className: '初一(1)班',
    phone: '13800138001',
    address: '北京市海淀区'
  },
  {
    id: '2023003',
    name: '王五',
    gender: '男',
    age: 15,
    className: '初一(2)班',
    phone: '13800138002',
    address: '北京市西城区'
  }
]);

// 搜索
const handleSearch = () => {
  console.log('搜索学员', searchText.value);
};

// 添加学员
const handleAddStudent = () => {
  console.log('添加学员');
};

// 编辑学员
const handleEdit = (row) => {
  console.log('编辑学员', row);
};

// 删除学员
const handleDelete = (row) => {
  console.log('删除学员', row);
};

// 改变每页大小
const handleSizeChange = (val) => {
  pageSize.value = val;
  console.log('每页大小:', val);
};

// 改变当前页
const handleCurrentChange = (val) => {
  currentPage.value = val;
  console.log('当前页:', val);
};
</script>

<style scoped>
.student-manage-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 20px;
  background: linear-gradient(to right, #e3f2fd, #bbdefb);
  padding: 15px;
  border-radius: 8px;
}

.page-description {
  color: #666;
  margin-top: 5px;
}

.student-content {
  margin-top: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
}

.search-input {
  width: 300px;
  margin-right: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 
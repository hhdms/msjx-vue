<template>
  <div class="employee-manage-container">
    <div class="page-header">
      <h1>员工管理</h1>
      <p class="page-description">管理学校所有教职工信息</p>
    </div>
    <div class="employee-content">
      <el-card shadow="hover" class="table-card">
        <template #header>
          <div class="operation-header">
            <div class="search-box">
              <el-input
                v-model="searchText"
                placeholder="请输入员工姓名或工号"
                class="search-input"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </div>
            <el-button type="primary" @click="handleAddEmployee">
              <el-icon><Plus /></el-icon>新增员工
            </el-button>
          </div>
        </template>
        <el-table :data="employeeData" border style="width: 100%" stripe>
          <el-table-column prop="id" label="工号" width="80" align="center" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="gender" label="性别" width="80" align="center" />
          <el-table-column prop="age" label="年龄" width="80" align="center" />
          <el-table-column prop="department" label="所属部门" width="150" />
          <el-table-column prop="position" label="职位" width="150" />
          <el-table-column prop="phone" label="联系电话" width="150" align="center" />
          <el-table-column prop="email" label="邮箱" />
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
const total = ref(36);

// 员工数据
const employeeData = ref([
  {
    id: 'EMP001',
    name: '张明',
    gender: '男',
    age: 35,
    department: '教研部',
    position: '数学教师',
    phone: '13900139000',
    email: 'zhangming@example.com'
  },
  {
    id: 'EMP002',
    name: '王丽',
    gender: '女',
    age: 32,
    department: '教研部',
    position: '语文教师',
    phone: '13900139001',
    email: 'wangli@example.com'
  },
  {
    id: 'EMP003',
    name: '李强',
    gender: '男',
    age: 40,
    department: '行政部',
    position: '行政主管',
    phone: '13900139002',
    email: 'liqiang@example.com'
  }
]);

// 搜索
const handleSearch = () => {
  console.log('搜索员工', searchText.value);
};

// 添加员工
const handleAddEmployee = () => {
  console.log('添加员工');
};

// 编辑员工
const handleEdit = (row) => {
  console.log('编辑员工', row);
};

// 删除员工
const handleDelete = (row) => {
  console.log('删除员工', row);
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
.employee-manage-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 20px;
  background: linear-gradient(to right, #f3e5f5, #e1bee7);
  padding: 15px;
  border-radius: 8px;
}

.page-description {
  color: #666;
  margin-top: 5px;
}

.employee-content {
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
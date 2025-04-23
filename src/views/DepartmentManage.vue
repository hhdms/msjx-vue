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
        
        <el-table :data="departmentData" border style="width: 100%" stripe v-loading="loading">
          <el-table-column prop="id" label="序号" width="80" align="center" />
          <el-table-column prop="name" label="部门名称" />
          <el-table-column prop="createTime" label="创建时间" align="center">
            <template #default="scope">
              {{ formatDateTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align="center">
            <template #default="scope">
              {{ formatDateTime(scope.row.updateTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 新增/编辑部门对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑部门' : '新增部门'"
      width="30%"
      @close="resetForm"
    >
      <el-form :model="departmentForm" :rules="rules" ref="departmentFormRef" label-width="80px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="departmentForm.name" placeholder="请输入部门名称，长度2-10位"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认框 -->
    <el-dialog
      v-model="deleteConfirmVisible"
      title="提示"
      width="30%"
    >
      <span>您确定要删除该部门吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteConfirmVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

// 创建axios实例，配置请求拦截器和响应拦截器
const http = axios.create({
  baseURL: '/api', // 使用代理路径
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 状态数据
const departmentData = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const deleteConfirmVisible = ref(false);
const isEdit = ref(false);
const departmentToDelete = ref(null);
const departmentFormRef = ref(null);

// 表单数据和校验规则
const departmentForm = reactive({
  id: '',
  name: ''
});

const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ]
};

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 模拟部门数据（后端未配置CORS时临时使用）
const mockDepartmentData = [
  {
    id: 1,
    name: '学工部',
    createTime: '2022-09-01T23:06:29',
    updateTime: '2022-09-01T23:06:29'
  },
  {
    id: 2,
    name: '教研部',
    createTime: '2022-09-01T23:06:29',
    updateTime: '2022-09-01T23:06:29'
  }
];

// 获取部门列表
const fetchDepartments = async () => {
  loading.value = true;
  try {
    const response = await http.get('/depts');
    if (response.data.code === 1) {
      departmentData.value = response.data.data;
    } else {
      ElMessage.error(response.data.msg || '获取部门列表失败');
    }
  } catch (error) {
    console.error('获取部门列表出错：', error);
    ElMessage.error('网络错误，请稍后重试');
    // 使用模拟数据(临时解决方案，等待后端配置CORS)
    departmentData.value = mockDepartmentData;
  } finally {
    loading.value = false;
  }
};

// 添加部门
const handleAddDepartment = () => {
  isEdit.value = false;
  dialogVisible.value = true;
};

// 编辑部门
const handleEdit = async (row) => {
  isEdit.value = true;
  loading.value = true;
  
  try {
    const response = await http.get(`/depts/${row.id}`);
    if (response.data.code === 1) {
      const deptData = response.data.data;
      departmentForm.id = deptData.id;
      departmentForm.name = deptData.name;
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || '获取部门详情失败');
    }
  } catch (error) {
    console.error('获取部门详情出错：', error);
    ElMessage.error('网络错误，请稍后重试');
    // 临时解决方案，直接使用当前行数据
    departmentForm.id = row.id;
    departmentForm.name = row.name;
    dialogVisible.value = true;
  } finally {
    loading.value = false;
  }
};

// 删除部门
const handleDelete = (row) => {
  departmentToDelete.value = row;
  deleteConfirmVisible.value = true;
};

// 确认删除
const confirmDelete = async () => {
  if (!departmentToDelete.value) return;
  
  loading.value = true;
  try {
    const response = await http.delete(`/depts/${departmentToDelete.value.id}`);
    if (response.data.code === 1) {
      ElMessage.success('删除部门成功');
      fetchDepartments(); // 重新加载数据
    } else {
      ElMessage.error(response.data.msg || '删除部门失败');
    }
  } catch (error) {
    console.error('删除部门出错：', error);
    ElMessage.error('网络错误，请稍后重试');
    // 临时解决方案，前端模拟删除
    const index = departmentData.value.findIndex(item => item.id === departmentToDelete.value.id);
    if (index !== -1) {
      departmentData.value.splice(index, 1);
      ElMessage.success('删除部门成功（前端模拟）');
    }
  } finally {
    loading.value = false;
    deleteConfirmVisible.value = false;
    departmentToDelete.value = null;
  }
};

// 重置表单
const resetForm = () => {
  if (departmentFormRef.value) {
    departmentFormRef.value.resetFields();
  }
  departmentForm.id = '';
  departmentForm.name = '';
};

// 提交表单
const submitForm = () => {
  if (!departmentFormRef.value) return;
  
  departmentFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        let response;
        if (isEdit.value) {
          // 编辑部门
          response = await http.put('/depts', {
            id: departmentForm.id,
            name: departmentForm.name
          });
        } else {
          // 新增部门
          response = await http.post('/depts', {
            name: departmentForm.name
          });
        }
        
        if (response.data.code === 1) {
          ElMessage.success(isEdit.value ? '更新部门成功' : '添加部门成功');
          dialogVisible.value = false;
          fetchDepartments(); // 重新加载数据
        } else {
          ElMessage.error(response.data.msg || (isEdit.value ? '更新部门失败' : '添加部门失败'));
        }
      } catch (error) {
        console.error(isEdit.value ? '更新部门出错：' : '添加部门出错：', error);
        ElMessage.error('网络错误，请稍后重试');
        
        // 临时解决方案，前端模拟添加/更新
        if (isEdit.value) {
          // 模拟编辑
          const index = departmentData.value.findIndex(item => item.id === departmentForm.id);
          if (index !== -1) {
            departmentData.value[index].name = departmentForm.name;
            ElMessage.success('更新部门成功（前端模拟）');
            dialogVisible.value = false;
          }
        } else {
          // 模拟添加
          const newId = departmentData.value.length > 0 
            ? Math.max(...departmentData.value.map(item => item.id)) + 1 
            : 1;
          const now = new Date().toISOString();
          
          departmentData.value.push({
            id: newId,
            name: departmentForm.name,
            createTime: now,
            updateTime: now
          });
          
          ElMessage.success('添加部门成功（前端模拟）');
          dialogVisible.value = false;
        }
      } finally {
        loading.value = false;
      }
    } else {
      return false;
    }
  });
};

// 组件挂载时加载数据
onMounted(() => {
  fetchDepartments();
});
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

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
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
  border-radius: 8px;
}

.operation-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style> 
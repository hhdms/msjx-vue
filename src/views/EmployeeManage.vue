<template>
  <div class="employee-manage-container">
    <div class="page-header">
      <h1>员工管理</h1>
      <p class="page-description">管理学校各个教职工信息</p>
    </div>
    
    <!-- 搜索区域 -->
    <el-card shadow="hover" class="filter-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="search-form">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="searchForm.gender" placeholder="请选择性别" clearable style="width: 120px;">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期" prop="dateRange">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            clearable
            style="width: 280px;"
            :locale="locale"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 表格区域 -->
    <div class="employee-content">
      <el-card shadow="hover" class="table-card">
        <template #header>
          <div class="operation-header">
            <div class="left-operations">
            <el-button type="primary" @click="handleAddEmployee">
              <el-icon><Plus /></el-icon>新增员工
            </el-button>
              <el-button type="danger" @click="handleBatchDelete" :disabled="selectedIds.length === 0">
                <el-icon><Delete /></el-icon>批量删除
              </el-button>
              <span class="selected-count" v-if="selectedIds.length > 0">已选择 {{ selectedIds.length }} 项</span>
            </div>
          </div>
        </template>
        
        <el-table 
          :data="employeeList" 
          border 
          style="width: 100%" 
          stripe 
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="gender" label="性别" width="60" align="center">
            <template #default="scope">
              {{ scope.row.gender === 1 ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column prop="position" label="职位" width="100" align="center">
            <template #default="scope">
              {{ formatPosition(scope.row.position) }}
            </template>
          </el-table-column>
          <el-table-column prop="deptName" label="部门" width="100" />
          <el-table-column prop="hireDate" label="入职日期" width="120" align="center" />
          <el-table-column prop="updateTime" label="更新时间" width="160" align="center">
            <template #default="scope">
              {{ formatDateTime(scope.row.updateTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="image" label="头像" width="80" align="center">
            <template #default="scope">
              <el-image
                :src="scope.row.image"
                :preview-src-list="[scope.row.image]"
                fit="cover"
                style="width: 40px; height: 40px; border-radius: 50%;"
              >
                <template #error>
                  <el-avatar :size="40" :src="defaultAvatar" />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" plain @click="handleDelete([scope.row.id])">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页区域 -->
        <div class="pagination-container">
          <div class="pagination-info">共 {{ total }} 条</div>
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            small
            :locale="locale"
          >
            <template #sizes="{ handleSizeChange }">
              <el-select 
                v-model="pageSize" 
                @change="handleSizeChange" 
                size="small" 
                class="page-size-select"
              >
                <el-option
                  v-for="item in [10, 20, 50, 100]"
                  :key="item"
                  :label="`${item}条/页`"
                  :value="item"
                />
              </el-select>
            </template>
            <template #jumper>
              <div class="pagination-jumper">
                前往
                <el-input
                  v-model.number="currentPage"
                  class="page-jump-input"
                  size="small"
                  :min="1"
                  :max="Math.ceil(total / pageSize)"
                />
                页
              </div>
            </template>
          </el-pagination>
        </div>
      </el-card>
    </div>

    <!-- 新增/编辑员工对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑员工' : '新增员工'"
      width="60%"
      @close="resetForm"
    >
      <el-form :model="employeeForm" :rules="rules" ref="employeeFormRef" label-width="100px">
        <!-- 第一行：用户名、姓名 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="employeeForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="employeeForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行：性别、手机号 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="employeeForm.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="employeeForm.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行：职位、薪资 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-select v-model="employeeForm.position" placeholder="请选择职位">
                <el-option label="班主任" :value="1"></el-option>
                <el-option label="讲师" :value="2"></el-option>
                <el-option label="学工主管" :value="3"></el-option>
                <el-option label="教研主管" :value="4"></el-option>
                <el-option label="咨询师" :value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪资" prop="salary">
              <el-input-number v-model="employeeForm.salary" :min="1" :step="1000" controls-position="right" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第四行：所属部门、入职日期 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属部门" prop="deptId">
              <el-select v-model="employeeForm.deptId" placeholder="请选择部门">
                <el-option v-for="dept in deptList" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="hireDate">
              <el-date-picker v-model="employeeForm.hireDate" type="date" placeholder="选择入职日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100%;" :locale="locale"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第五行：头像上传 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="头像" prop="image">
              <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="employeeForm.image" :src="employeeForm.image" class="avatar" />
                <div v-else class="avatar-uploader-icon">
                  <el-icon><Plus /></el-icon>
                </div>
              </el-upload>
              <div class="upload-tip">提示: 上传大小不超过2M的JPG、PNG图片</div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第六行：工作经历 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="工作经历">
              <div>
                <el-button type="primary" plain size="small" @click="addExperience">
                  <el-icon><Plus /></el-icon>新增工作经历
                </el-button>
              </div>
              <div v-for="(expr, index) in employeeForm.exprList" :key="index" class="experience-item" style="margin-top: 10px;">
                <el-row :gutter="10" align="middle">
                  <el-col :span="9">
                    <el-form-item :label="'时间'" :prop="'exprList.' + index + '.startDate'" :rules="[{ required: true, message: '请选择开始时间', trigger: 'change' }]" style="margin-bottom: 0;">
                      <div class="date-range-container">
                        <el-date-picker 
                          v-model="expr.startDate" 
                          type="date" 
                          placeholder="开始日期" 
                          format="YYYY-MM-DD" 
                          value-format="YYYY-MM-DD" 
                          style="width: 47%;" 
                          :locale="locale"
                          size="small"
                        ></el-date-picker>
                        <span class="date-separator">至</span>
                        <el-date-picker 
                          v-model="expr.endDate" 
                          type="date" 
                          placeholder="结束日期" 
                          format="YYYY-MM-DD" 
                          value-format="YYYY-MM-DD" 
                          style="width: 47%;" 
                          :locale="locale"
                          size="small"
                        ></el-date-picker>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item :label="'公司'" :prop="'exprList.' + index + '.company'" :rules="[{ required: true, message: '请输入公司', trigger: 'blur' }]" style="margin-bottom: 0;">
                      <el-input v-model="expr.company" placeholder="公司名称" size="small"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item :label="'职位'" :prop="'exprList.' + index + '.position'" :rules="[{ required: true, message: '请输入职位', trigger: 'blur' }]" style="margin-bottom: 0;">
                      <el-input v-model="expr.position" placeholder="职位" size="small"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align: center;">
                    <el-button type="danger" icon="Delete" size="small" circle @click="removeExperience(index)" v-if="employeeForm.exprList.length > 1"></el-button>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认框 -->
    <el-dialog
      v-model="deleteConfirmVisible"
      title="删除确认"
      width="30%"
    >
      <span>确定要删除选中的员工吗？此操作不可恢复。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteConfirmVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete" :loading="deleteLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { Plus, Delete } from '@element-plus/icons-vue';

// 国际化设置
const locale = zhCn

// 配置Element Plus全局语言
const useElementLocale = () => {
  // 如果可能，这里会设置Element Plus的全局语言
  // 在实际应用中，您可能需要在main.js中设置
  console.log('已设置Element Plus语言为中文');
};

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';

// 状态数据
const loading = ref(false);
const submitLoading = ref(false);
const deleteLoading = ref(false);
const dialogVisible = ref(false);
const deleteConfirmVisible = ref(false);
const isEdit = ref(false);
const activeTab = ref('basic');
const deptList = ref([]);
const employeeList = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const selectedIds = ref([]);
const idsToDelete = ref([]);
const employeeFormRef = ref(null); // 添加表单引用

// 搜索表单
const searchForm = reactive({
  name: '',
  gender: '',
  dateRange: [],
});

// 员工表单
const employeeForm = reactive({
  id: '',
  username: '',
  name: '',
  gender: 1,
  image: '',
  position: 1,
  salary: 5000,
  hireDate: '',
  deptId: '',
  phone: '',
  exprList: [
    {
      company: '',
      position: '',
      startDate: '',
      endDate: ''
    }
  ]
});

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符之间', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2到20个字符之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  position: [
    { required: true, message: '请选择职位', trigger: 'change' }
  ],
  salary: [
    { required: true, message: '请输入薪资', trigger: 'blur' }
  ],
  hireDate: [
    { required: true, message: '请选择入职日期', trigger: 'change' }
  ],
  deptId: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
};

// 格式化职位显示
const formatPosition = (position) => {
  const positionMap = {
    1: '班主任',
    2: '讲师',
    3: '学工主管',
    4: '教研主管',
    5: '咨询师'
  };
  return positionMap[position] || '未知职位';
};

// 获取部门列表
const fetchDepartments = async () => {
  try {
    const response = await axios.get('/depts');
    if (response.data.code === 1) {
      deptList.value = response.data.data;
    }
  } catch (error) {
    console.error('获取部门列表出错：', error);
    ElMessage.error('获取部门列表失败');
  }
};

// 获取员工列表
const fetchEmployees = async () => {
  loading.value = true;
  try {
    // 构建查询参数
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value
    };
    
    if (searchForm.name) {
      params.name = searchForm.name;
    }
    
    if (searchForm.gender) {
      params.gender = searchForm.gender;
    }
    
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.begin = searchForm.dateRange[0];
      params.end = searchForm.dateRange[1];
    }
    
    const response = await axios.get('/emps', { params });
    if (response.data.code === 1) {
      employeeList.value = response.data.data.rows;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || '获取员工列表失败');
    }
  } catch (error) {
    console.error('获取员工列表出错：', error);
    ElMessage.error('网络错误，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchEmployees();
};

// 重置搜索
const resetSearch = () => {
  searchForm.name = '';
  searchForm.gender = '';
  searchForm.dateRange = [];
  currentPage.value = 1;
  fetchEmployees();
};

// 表格选择变化
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id);
};

// 添加员工
const handleAddEmployee = () => {
  isEdit.value = false;
  resetForm();
  dialogVisible.value = true;
};

// 编辑员工
const handleEdit = async (row) => {
  isEdit.value = true;
  resetForm();
  loading.value = true;
  
  try {
    const response = await axios.get(`/emps/${row.id}`);
    if (response.data.code === 1) {
      const data = response.data.data;
      
      // 填充表单数据并确保数字类型字段正确
      Object.assign(employeeForm, {
        ...data,
        id: data.id,
        deptId: Number(data.deptId || 0),
        gender: Number(data.gender || 1),
        position: Number(data.position || 1),
        salary: Number(data.salary || 0)
      });
      
      // 确保工作经历列表存在
      if (!data.exprList || data.exprList.length === 0) {
        employeeForm.exprList = [{
          company: '',
          position: '',
          startDate: '',
          endDate: ''
        }];
      } else {
        employeeForm.exprList = data.exprList;
      }
      
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || '获取员工详情失败');
    }
  } catch (error) {
    console.error('获取员工详情出错：', error);
    ElMessage.error('网络错误，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 删除单个员工
const handleDelete = (ids) => {
  idsToDelete.value = ids;
  deleteConfirmVisible.value = true;
};

// 批量删除员工
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要删除的员工');
    return;
  }
  
  idsToDelete.value = selectedIds.value;
  deleteConfirmVisible.value = true;
};

// 确认删除
const confirmDelete = async () => {
  if (idsToDelete.value.length === 0) return;
  
  deleteLoading.value = true;
  try {
    const response = await axios.delete('/emps', {
      params: { ids: idsToDelete.value.join(',') }
    });
    
    if (response.data.code === 1) {
      ElMessage.success('删除员工成功');
      selectedIds.value = [];
      fetchEmployees(); // 重新加载数据
    } else {
      ElMessage.error(response.data.msg || '删除员工失败');
    }
  } catch (error) {
    console.error('删除员工出错：', error);
    ElMessage.error('网络错误，请稍后重试');
  } finally {
    deleteLoading.value = false;
    deleteConfirmVisible.value = false;
  }
};

// 改变每页大小
const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchEmployees();
};

// 改变当前页
const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchEmployees();
};

// 头像上传前的处理
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error('头像只能是JPG或PNG格式!');
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过2MB!');
  }
  return isJPG && isLt2M;
};

// 头像上传成功的处理
const handleAvatarSuccess = (res, file) => {
  if (res.code === 1) {
    employeeForm.image = res.data; // 假设返回的数据中包含图片URL
  } else {
    ElMessage.error('上传失败: ' + res.msg);
  }
};

// 添加工作经历
const addExperience = () => {
  employeeForm.exprList.push({
    company: '',
    position: '',
    startDate: '',
    endDate: ''
  });
};

// 移除工作经历
const removeExperience = (index) => {
  employeeForm.exprList.splice(index, 1);
};

// 重置表单
const resetForm = () => {
  employeeForm.id = '';
  employeeForm.username = '';
  employeeForm.name = '';
  employeeForm.gender = 1;
  employeeForm.image = '';
  employeeForm.position = 1;
  employeeForm.salary = 5000;
  employeeForm.hireDate = '';
  employeeForm.deptId = '';
  employeeForm.phone = '';
  employeeForm.exprList = [
    {
      company: '',
      position: '',
      startDate: '',
      endDate: ''
    }
  ];
  activeTab.value = 'basic';
};

// 提交表单
const submitForm = async () => {
  // 使用ref获取表单引用 - 确保在模板中添加了ref="employeeFormRef"
  if (!employeeFormRef.value) {
    ElMessage.warning('表单引用获取失败');
    return;
  }
  
  submitLoading.value = true;
  
  try {
    // 使用Element Plus的标准表单验证方式
    await employeeFormRef.value.validate();
    
    // 处理提交的数据
    const formData = {
      ...employeeForm,
      // 确保数字类型字段为数字
      deptId: Number(employeeForm.deptId || 0),
      gender: Number(employeeForm.gender || 1),
      position: Number(employeeForm.position || 1),
      salary: Number(employeeForm.salary || 0)
    };
    
    // 过滤掉不完整的工作经历
    if (employeeForm.exprList && employeeForm.exprList.length > 0) {
      formData.exprList = employeeForm.exprList.filter(item => 
        item.company && item.position && item.startDate && item.endDate
      );
    } else {
      formData.exprList = [];
    }
    
    // 表单验证已经通过，但仍然检查关键字段
    if (!formData.username || !formData.name || !formData.phone || !formData.hireDate) {
      ElMessage.error('请填写所有必填字段');
      return;
    }
    
    // 确保日期格式正确
    if (formData.hireDate && typeof formData.hireDate === 'string') {
      // 确保日期格式为YYYY-MM-DD
      if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.hireDate)) {
        ElMessage.error('入职日期格式不正确，应为YYYY-MM-DD格式');
        return;
      }
    }
    
    // 记录请求数据，便于调试
    console.log('提交的表单数据:', JSON.stringify(formData, null, 2));
    
    let response;
    
    // 确保在编辑模式下，id字段存在且有效
    if (isEdit.value) {
      // 编辑员工 - 确保id字段存在
      if (!formData.id) {
        ElMessage.error('员工ID不能为空，无法更新');
        return;
      }
      response = await axios.put('/emps', formData);
    } else {
      // 新增员工 - 确保不包含id字段
      delete formData.id;
      response = await axios.post('/emps', formData);
    }
    
    if (response.data.code === 1) {
      ElMessage.success(isEdit.value ? '更新员工成功' : '添加员工成功');
      dialogVisible.value = false;
      fetchEmployees(); // 重新加载数据
    } else {
      ElMessage.error(response.data.msg || (isEdit.value ? '更新员工失败' : '添加员工失败'));
    }
  } catch (error) {
    console.error(isEdit.value ? '更新员工出错：' : '添加员工出错：', error);
    
    if (error.response) {
      console.error('错误响应状态:', error.response.status);
      console.error('错误响应数据:', error.response.data);
      
      if (error.response.data && error.response.data.msg) {
        // 显示后端返回的具体错误信息
        ElMessage.error(`提交失败: ${error.response.data.msg}`);
      } else if (error.response.status === 400) {
        // 400错误通常是请求参数有问题
        ElMessage.error('提交的数据格式不正确，请检查表单填写是否完整');
        console.log('请检查以下字段:', formData);
      } else {
        ElMessage.error(`请求错误 (${error.response.status})`);
      }
    } else if (error.request) {
      console.error('未收到响应:', error.request);
      ElMessage.error('服务器未响应，请检查网络连接');
    } else {
      console.error('请求配置错误:', error.message);
      ElMessage.error(error.message || '请求配置错误');
    }
  } finally {
    submitLoading.value = false;
  }
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

// 组件挂载时初始化数据
onMounted(() => {
  useElementLocale();
  fetchDepartments();
  fetchEmployees();
});
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
  background: linear-gradient(to right, #e3f2fd, #bbdefb);
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

.filter-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.employee-content {
  margin-top: 20px;
}

.table-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-operations {
  display: flex;
  align-items: center;
  gap: 10px;
}

.batch-operation {
  display: none; /* 隐藏原来的批量操作区域 */
}

.selected-count {
  margin-left: 10px;
  color: #606266;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-info {
  margin-right: 15px;
  color: #606266;
  font-size: 13px;
}

.page-jump-input {
  width: 50px;
  margin: 0 5px;
}

.pagination-jumper {
  display: flex;
  align-items: center;
  margin-left: 10px;
  color: #606266;
  font-size: 13px;
}

.page-size-select {
  width: 110px;
  margin-right: 15px;
}

.avatar-uploader {
  text-align: center;
  width: 178px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  object-fit: cover;
}

.upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 8px;
}

.date-range-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.date-separator {
  color: #606266;
  padding: 0 5px;
}

.experience-item {
  padding: 10px;
  border-radius: 4px;
  background-color: #f8f9fa;
  margin-bottom: 10px;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.experience-header h3 {
  margin: 0;
  font-size: 16px;
  color: #606266;
}

.add-experience {
  margin-top: 20px;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style> 
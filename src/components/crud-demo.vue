<template>
  <div class="table-container">
    <div class="title">
      <h2>这是一个简单curd</h2>
    </div>
    <!-- 输入部分 -->
    <div class="query-box">
      <el-input class="input" v-model="querInput" placeholder="请输入您需要搜索的信息" @input="queryData"></el-input>
      <!-- 提交部分 -->
      <div class="submit">
        <el-button class="bnt" @click="openDialog" type="primary">增加</el-button>
        <el-button class="bnt" @click="deleteList" type="danger">删除多选</el-button>
        <!-- 弹窗 -->
        <el-dialog v-model="dialogFormVisible" :title="is_edit?'编辑您的信息':'请输入您的个人信息'" :show-close=false>
          <el-form :model="form">
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input class="form-item-input" v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
              <el-input class="form-item-input" v-model="form.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="手机" :label-width="formLabelWidth">
              <el-input class="form-item-input" v-model="form.phone" autocomplete="off" />
            </el-form-item>
            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-select class="form-item-input" v-model="form.state" placeholder="请选择您当前的状态">
                <el-option label="在职" value="在职" />
                <el-option label="离职" value="离职" />
              </el-select>
            </el-form-item>
            <el-form-item label="地址" :label-width="formLabelWidth">
              <el-input v-model="form.address" autocomplete="off" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="coloseDialog">取消</el-button>
              <el-button type="primary" @click="confirmDialog(val)">确认</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
    <!-- 表格部分 -->
    <div class="table-box">
      <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange"
        border>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="date" label="时间" width="150" />
        <el-table-column fixed prop="name" label="姓名" width="100" />
        <el-table-column prop="state" label="状态" width="100" />
        <el-table-column prop="phone" label="手机" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="address" label="地址" width="600" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="deleteData(scope.row)" style="color:#F56C6C">删除
            </el-button>
            <el-button link type="primary" size="small" @click.prevent="editData(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { ref, watch } from 'vue';
/* 表格 */
// 多选按钮
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = []
  val.forEach(item => {
    multipleSelection.value.push(item.id)
  })
  console.log(multipleSelection.value)
}
const multipleTableRef = ref()
// 删除多选按钮
const deleteList = () => {
  multipleSelection.value.forEach(id => {
    deleteData({id})
  })
  multipleSelection.value = []
}
let tableData = ref([
  {
    id: 0,
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    phone: 18318630940,
    email: '249289578@qq.com',
    address: 'No. 189, Grove St, Los Angeles',
  },
])
// 浅拷贝一个副本数据
let tableDataCopy = ref([])
Object.assign(tableDataCopy.value,tableData.value)
// 删除按钮
const deleteData = ({ id }) => {
  let index = tableData.value.findIndex(item =>item.id === id)
  tableData.value.splice(index, 1)
}
//  编辑按钮
let is_edit = ref(false)
const editData = (val) => {
  is_edit.value = true
  form.value = {...val}
  openDialog()
}
/* 弹窗 */
const dialogTableVisible = ref(false)
const dialogFormVisible = ref(false)
const formLabelWidth = '50px'
let form = ref({
  name: '',
  email: '',
  phone: '',
  state: '',
  address: ''
})
// 确认按钮
const now = new Date()
const confirmDialog = (val) => {
  dialogFormVisible.value = false
  if (!is_edit.value) {
    tableData.value.push({
      date: dayjs(now).format('YYYY-MM-DD'),
      id: tableData.value.length !== 0 ? tableData.value[tableData.value.length - 1].id + 1 : 0,
      ...form.value
    })
  } else {
    let index = tableData.value.findIndex(item => item.id === form.value.id)
    tableData.value[index] = {...form.value}
  }
}
// 取消按钮
const coloseDialog = () => {
  dialogFormVisible.value = false
}
// 打开弹窗
const openDialog = () => {
  if(!is_edit.value){
    form.value = {}
  }
  dialogFormVisible.value = true
}
// 监听弹窗文字提示
watch(dialogFormVisible, () => {
  if (!dialogFormVisible.value) {
    is_edit.value = false
  }
})
/* 搜索功能 */
let querInput = ref('')
const queryData = ()=>{
  if(querInput.value.length>0){
    tableData.value = tableData.value.filter(item=>item.name.toUpperCase().match(querInput.value.toUpperCase()))
  }else{
    tableData.value = tableDataCopy.value
    console.log(tableDataCopy.value)
  }
}
</script>

<style lang="less" scoped>
.table-container {
  width: 1000px;
  height: 600px;
  margin: 100px auto;

  .title {
    text-align: center;
  }

  .query-box {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;

    .input {
      width: 40%;
      margin-right: 10px;
    }
  }

  .submit {
    .form-item-input {
      width: 200px;
    }
  }
}
</style>
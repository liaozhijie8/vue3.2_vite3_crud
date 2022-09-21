<template>
  <div class="table-container">
    <div class="title">
      <h2>这是一个简单curd</h2>
    </div>
    <!-- 输入部分 -->
    <div class="query-box">
      <el-input class="input" v-model="querInput" placeholder="请输入您需要搜索的信息" @change="queryData"></el-input>
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
        <el-table-column prop="UpdatedAt" label="时间" width="150" />
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
      <!-- 分页 -->
      <div class="page-box">
        <el-pagination background layout="prev, pager, next" @current-change="currentChange" :total="pageNum"
          :page-size="pageSize" v-model:current-page="currentPage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import dayjs from 'dayjs'
import { onMounted, ref, watch } from 'vue'
import request from '../utils/request'
import {useStore} from '../store/curd'
import {storeToRefs} from 'pinia'
import { computed } from '@vue/reactivity';
const curd = useStore()
const {count} = storeToRefs(curd)
// 分页设置
let pageNum = ref(2)//总数
let pageSize = ref(5)//每页有多少
let currentPage = ref(1)
let querInput = ref('')
const multipleTableRef = ref()
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
let form = ref({
  name: '',
  email: '',
  phone: '',
  state: '',
  address: ''
})
/* 弹窗 */
const dialogTableVisible = ref(false)
const dialogFormVisible = ref(false)
const formLabelWidth = '50px'
// 浅拷贝一个副本数据
let tableDataCopy = ref([])
Object.assign(tableDataCopy.value, tableData.value)
/* 表格 */
// 多选按钮
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = []
  val.forEach(item => {
    multipleSelection.value.push(item.ID)
  })
  console.log(multipleSelection.value)
}
// 删除多选按钮
const deleteList = () => {
  multipleSelection.value.forEach(ID => {
    deleteData({ ID })
  })
  multipleSelection.value = []
}
// 删除按钮
const deleteData = async ({ ID }) => {
  // let index = tableData.value.findIndex(item => item.id === id)
  // tableData.value.splice(index, 1)
  await request.delete(`/delete/${ID}`)
  await getTableData(currentPage)
}
//  编辑按钮
let is_edit = ref(false)
const editData = (val) => {
  is_edit.value = true
  form.value = { ...val }
  openDialog()
}
/* 增加数据 */
// 确认按钮
const now = new Date()
const dataChange = computed(()=>{
  return dayjs(now).format('YYYY-MM-DD')
})
const confirmDialog = async (val) => {
  console.log(currentPage.value)
  dialogFormVisible.value = false
  if (!is_edit.value) {
    // 新增数据
    await request.post('/add', {
      ...form.value
    })
    /* tableData.value.push({
      date: dayjs(now).format('YYYY-MM-DD'),
      id: tableData.value.length !== 0 ? tableData.value[tableData.value.length - 1].id + 1 : 0,
      ...form.value
    }) */
  } else {
    // let index = tableData.value.findIndex(item => item.id === form.value.id)
    // tableData.value[index] = { ...form.value }
    await request.put(`/update/${form.value.ID}`,{
      ...form.value
    })
  }
  await getTableData(currentPage.value)
}
// 取消按钮
const coloseDialog = () => {
  dialogFormVisible.value = false
}
// 打开弹窗
const openDialog = () => {
  if (!is_edit.value) {
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

const queryData = async (val) => {
  if (querInput.value.length > 0) {
    // 查询数据库
  tableData.value = await request.get(`/list/${val}`)
    // tableData.value = tableData.value.filter(item => item.name.toUpperCase().match(querInput.value.toUpperCase()))
  } else {
    // tableData.value = tableDataCopy.value
    await getTableData()
  }
}
/* axios */
const getTableData = async (cur = 1) => {
  let res = await request.get('/list', {
    pageSize: 5,
    pageNum: cur
  })
  tableData.value = res.list
  pageNum.value = res.total
  pageSize.value = res.pageSize
}
const currentChange = (val) => {
  currentPage.value = val
  getTableData(val)
}
onMounted(()=>{
  getTableData(),
  curd.getTableData()
})
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

  .page-box {
    margin-top: 5px;
    display: flex;
    justify-content: center;
  }
}
</style>
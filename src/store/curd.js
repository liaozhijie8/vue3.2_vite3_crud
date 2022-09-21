import { defineStore } from 'pinia'
import request from '../utils/request'
export const useStore = defineStore('main', {
  state:()=>{
    return {
      count:0,
      tableData:[]
    }
  },
  actions:{
    async getTableData(cur=1) {
      let res = await request.get('/list', {
        pageSize: 5,
        pageNum: cur
      })
      this.tableData = res.list
      // pageNum.value = res.total
      // pageSize.value = res.pageSize
      console.log(res.list)
    }
  },
  getters:{
    double:(state)=>{
      return state.count += 2
    }
  }
})
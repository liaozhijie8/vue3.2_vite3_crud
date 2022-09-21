/* 全局配置 */
import axios from "axios"
import { ElMessage } from "element-plus"
const instance = axios.create({
  baseURL:"/user",
  timeout:8000
})

// 响应拦截
instance.interceptors.response.use(res=>{
  const {code,data,msg} = res.data
  if(code === 200){
    ElMessage.success(msg)
    return data
  } else if(code === 400){
    ElMessage.error(msg)
  }
})

// 请求方法
function request(option){
  option.method = option.method || 'get'
  if(option.method.toLowerCase()==='get'){
    option.params = option.data
  }
  return instance(option)
}

['get','post','put','delete'].forEach(item=>{
  request[item] = (url,data) =>{
    return request({
      url,
      data,
      method:item
    }) 
  }
  
})

export default request
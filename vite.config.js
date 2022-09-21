import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    // 跨域
    proxy:{
      '/user':{
        target:"http://127.0.0.1:3006/"
      }
    }
  },
  base:'./',//打包的相对路径
})

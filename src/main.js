import Vue from 'vue'
import App from './App'

// 引入自己封装的Vue插件
import request from './Utils/request.js'
// 注册
Vue.use(request)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
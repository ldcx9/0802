import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// ui框架
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


// import ElementPlus from 'element-plus'
// Vue.use(ElementPlus);
// import 'element-plus/dist/index.css'


// 表格导出
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

// 原型挂载请求
Vue.config.productionTip = false
Vue.prototype.$axios = axios;

// 公共路径
axios.defaults.publicPath = '/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

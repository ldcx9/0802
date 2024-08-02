import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入页面
import login from '../views/login'
import baseIndex from '../views/baseIndex'
import group from '../views/group'
import info from '../views/info'
import key from '../views/key'
import setting from '../views/setting'
import user from '../views/user'
import home from '../views/home'
Vue.use(VueRouter)

// 解决刷新路由 Element-ui报错
const originalPush=VueRouter.prototype.push
VueRouter.prototype.push=function push(location){
  return originalPush.call(this,location).catch(err=>err)
}

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/baseIndex', redirect: '/home' },
  {
    path: '/baseIndex',
    component: baseIndex,
    children: [
      { path: 'home', component: home },
      { path: 'group', component: group },
      { path: 'info', component: info },
      { path: 'key', component: key },
      { path: 'setting', component: setting },
      { path: 'user', component: user },
    ]
  },
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = localStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router

import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/views/login.vue';
import BaseIndex from '@/views/baseIndex.vue';
import Home from '@/views/home.vue';
import User from '@/views/user.vue';
import Group from '@/views/group.vue';
import Key from '@/views/key.vue';
import Info from '@/views/info.vue';
import Setting from '@/views/setting.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/baseIndex',
    component: BaseIndex,
    redirect: '/home',
    children: [
      { path: '/home', component: Home },
      { path: '/user', component: User },
      { path: '/group', component: Group },
      { path: '/key', component: Key },
      { path: '/info', component: Info },
      { path: '/setting', component: Setting },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.path !== '/login' && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
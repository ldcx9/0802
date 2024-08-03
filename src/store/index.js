import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import config from './modules/config';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    config,
  },
});
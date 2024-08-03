import { getConfig, updateConfig } from '@/api';

const state = {
  systemConfig: null,
};

const mutations = {
  SET_SYSTEM_CONFIG(state, config) {
    state.systemConfig = config;
  },
};

const actions = {
  async fetchConfig({ commit }) {
    try {
      const response = await getConfig();
      if (response.data.code === 2000) {
        commit('SET_SYSTEM_CONFIG', response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Failed to fetch config:', error);
      throw error;
    }
  },
  async updateConfig({ commit }, configData) {
    try {
      const response = await updateConfig(configData);
      if (response.data.code === 2000) {
        commit('SET_SYSTEM_CONFIG', response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Failed to update config:', error);
      throw error;
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
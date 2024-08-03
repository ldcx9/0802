import { login, getAllUsers, findUserByName, updateUser, deleteUser, registerUser } from '@/api';

const state = {
  currentUser: null,
  userList: [],
};

const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user;
  },
  SET_USER_LIST(state, users) {
    state.userList = users;
  },
};

const actions = {
  async login({ commit }, userData) {
    try {
      const response = await login(userData);
      if (response.data.code === 2000) {
        commit('SET_CURRENT_USER', response.data.data);
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userName', response.data.data.userName);
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  async getAllUsers({ commit }) {
    try {
      const response = await getAllUsers();
      if (response.data.code === 2000) {
        commit('SET_USER_LIST', response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Failed to get all users:', error);
      throw error;
    }
  },
  async findUserByName({ commit }, userName) {
    try {
      const response = await findUserByName(userName);
      if (response.data.code === 2000) {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Failed to find user:', error);
      throw error;
    }
  },
  async updateUser({ dispatch }, { userId, userData }) {
    try {
      const response = await updateUser(userId, userData);
      if (response.data.code === 2000) {
        await dispatch('getAllUsers');
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },
  async deleteUser({ dispatch }, userId) {
    try {
      const response = await deleteUser(userId);
      if (response.data.code === 2000) {
        await dispatch('getAllUsers');
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },
  async registerUser({ dispatch }, userData) {
    try {
      const response = await registerUser(userData);
      if (response.data.code === 2000) {
        await dispatch('getAllUsers');
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Failed to register user:', error);
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
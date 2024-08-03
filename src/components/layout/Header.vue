<template>
    <header class="header">
      <div class="logo">
        <h1>机器人管理系统</h1>
      </div>
      <div class="user-info">
        <span>您好，{{ userName }}</span>
        <el-button type="text" @click="logout" class="logout-btn">
          <i class="el-icon-switch-button"></i> 退出
        </el-button>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'Header',
    data() {
      return {
        userName: localStorage.getItem('userName') || ''
      };
    },
    methods: {
      logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .logo h1 {
    font-size: 1.2rem;
    color: #333;
  }
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .logout-btn {
    margin-left: 15px;
  }
  </style>
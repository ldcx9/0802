<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-title">机器人管理系统</div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" @submit.native.prevent="handleLogin">
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" prefix-icon="el-icon-user" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading" class="login-button">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { login } from '@/api';

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loading: false,
      rememberPassword: false
    };
  },
  methods: {
    async handleLogin() {
      try {
        await this.$refs.loginForm.validate();
        this.loading = true;
        const response = await login(this.loginForm);
        if (response.data.code === 2000) {
          this.$message.success('登录成功');
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('userName', response.data.data.userName);
          if (this.rememberPassword) {
            localStorage.setItem('rememberPassword', 'true');
            localStorage.setItem('savedUserName', this.loginForm.userName);
            localStorage.setItem('savedPassword', this.loginForm.password);
          } else {
            localStorage.removeItem('rememberPassword');
            localStorage.removeItem('savedUserName');
            localStorage.removeItem('savedPassword');
          }
          this.$router.push('/home');
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('登录失败:', error);
        this.$message.error('登录失败，请重试');
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    if (localStorage.getItem('rememberPassword') === 'true') {
      this.rememberPassword = true;
      this.loginForm.userName = localStorage.getItem('savedUserName') || '';
      this.loginForm.password = localStorage.getItem('savedPassword') || '';
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  width: 350px;
}

.login-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
}
</style>
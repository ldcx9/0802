<template>
  <div v-loading="loading" class="bg_img">
    <div class="position_center">
      <div class="title_login">机器人管理系统</div>
      <div class="box_login">
        <div class="header_title margin_bottom_20">欢迎登录</div>
        <div class="login_user margin_bottom_20">
          <img src="../assets/user.png" alt="UserName" />
          <input type="text" v-model="form.userName" placeholder="账号" />
        </div>
        <div class="login_user margin_bottom_15">
          <img src="../assets/password.png" alt="UserName" />
          <input type="password" v-model="form.password" placeholder="密码" />
        </div>
        <div class="flex_sp user_password">
          <div>
            <img @click="toggleRememberPassword" :src="rememberPassword ? img1 : img2" alt="sure" />记住密码
          </div>
        </div>
        <div @click="login" class="btn_login">登录</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rememberPassword: false,
      img1: require("../assets/select.png"),
      img2: require("../assets/noSelect.png"),
      form: {
        userName: "",
        password: "",
      },
      loading: false,
    };
  },
  methods: {
    toggleRememberPassword() {
      this.rememberPassword = !this.rememberPassword;
      if (this.rememberPassword) {
        localStorage.setItem("rememberPassword", "true");
      } else {
        localStorage.removeItem("rememberPassword");
        localStorage.removeItem("userName");
        localStorage.removeItem("password");
      }
    },
    login() {
      if (this.form.userName === "") {
        this.$message.warning("请输入账号！");
        return;
      }
      if (this.form.password === "") {
        this.$message.warning("请输入密码！");
        return;
      }
      this.loading = true;
      
      this.$axios.post('http://106.55.225.211:81/api/Auth/Login', this.form)
        .then((res) => {
          console.log('登录==>', res);
          if (res.data.code !== 2000) {
            this.$message.error(res.data.message);
            this.loading = false;
            return;
          }
          this.loading = false;
          
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("userName", res.data.data.userName);
          localStorage.setItem("userRole", res.data.data.role);
          
          if (this.rememberPassword) {
            localStorage.setItem("password", this.form.password);
          } else {
            localStorage.removeItem("password");
          }
          
          this.$message({
            message: "登录成功",
            type: "success",
            duration: 1000,
          });

          this.$nextTick(() => {
            this.$router.push("/baseIndex/home");
          });
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
          this.$message.error("登录失败，请重试");
        });
    },
  },
  mounted() {
    const rememberedPassword = localStorage.getItem("rememberPassword");
    if (rememberedPassword === "true") {
      this.rememberPassword = true;
      this.form.userName = localStorage.getItem("userName") || "";
      this.form.password = localStorage.getItem("password") || "";
    }
  },
};
</script>

<style>
.position_center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.box_login {
  width: 480px;
  height: 367px;
  background: #ffffff;
  box-shadow: 0px 3px 10px 0px rgba(223, 223, 223, 0.5);
  border-radius: 2px;
  padding: 40px 60px;
  box-sizing: border-box;
}

.header_title {
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #00c08f;
}

.login_user {
  width: 360px;
  height: 48px;
  background: #feffff;
  box-shadow: 2px 2px 3px 0px rgba(176, 176, 176, 0.5);
  border-radius: 5px;
  border: 1px solid #eaeaea;
  padding: 14px 10px;
  box-sizing: border-box;
}

.login_user img {
  width: 20px;
  height: 20px;
}

.login_user input {
  height: 150%;
  width: 85%;
  position: relative;
  bottom: 5px;
  left: 8px;
  background: none;
  outline: none;
  border: none;
}

.user_password div img {
  width: 16px;
  height: 16px;
  position: relative;
  top: 3px;
  margin-right: 5px;
}

.user_password div {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
}

.regret_password {
  cursor: pointer;
  color: #00c08f !important;
}

.btn_login {
  width: 360px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: #00c08f;
  box-shadow: 0px 3px 6px 0px rgba(28, 113, 255, 0.52);
  border-radius: 5px;
  margin-top: 40px;
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}

.bg_img {
  height: 100vh;
  background-image: url("../assets/loginbg.png");
}

.flex_between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex_between span:first-child {
  width: 100px;
  text-align: right;
}

.title_login {
  margin-bottom: 40px;
  text-align: center;
  font-size: 26px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
}

.margin_bottom_20 {
  margin-bottom: 20px;
}

.margin_bottom_15 {
  margin-bottom: 15px;
}

.flex_sp {
  display: flex;
  justify-content: space-between;
}

.dia_btn {
  margin-top: 20px;
  text-align: right;
}

.dia_btn button {
  margin-left: 10px;
  padding: 5px 15px;
  background-color: #00c08f;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.dia_btn button:first-child {
  background-color: #ccc;
}
</style>
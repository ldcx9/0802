<template>
  <div class="admin-layout">
    <header class="header">
      <div class="logo">
        <!-- <img src="../assets/logo.svg" alt="Logo" /> -->
        <h1>机器人管理系统</h1>
      </div>
      <div class="user-info">
        <span>您好，{{ userName }}</span>
        <el-button type="text" @click="outLogin" class="logout-btn">
          <i class="el-icon-switch-button"></i> 退出
        </el-button>
      </div>
    </header>
    <div class="main-container">
      <aside class="sidebar">
        <el-menu
          :default-active="showActiveImg"
          class="el-menu-vertical"
          @select="handselect"
          router
          background-color="#2c3e50"
          text-color="#fff"
          active-text-color="#42b983"
        >
          <el-menu-item index="1" route="/baseIndex/home">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="2" route="/baseIndex/user">
            <i class="el-icon-s-cooperation"></i>
            <span>账号管理</span>
          </el-menu-item>
          <el-menu-item index="3" route="/baseIndex/group">
            <i class="el-icon-s-cooperation"></i>
            <span>群聊管理</span>
          </el-menu-item>
    
          <el-menu-item index="4" route="/baseIndex/key">
            <i class="el-icon-s-cooperation"></i>
            <span>关键词管理 </span>
          </el-menu-item>
          <el-menu-item index="5" route="/baseIndex/info">
            <i class="el-icon-s-cooperation"></i>
            <span>登记管理</span>
          </el-menu-item>
          <el-menu-item index="6" route="/baseIndex/setting">
            <i class="el-icon-s-cooperation"></i>
            <span>系统设置</span>
          </el-menu-item>
          <!-- 其他菜单项 -->
        </el-menu>
      </aside>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      data: "aaa",
      showActiveImg: "",
      iconImg: [
        {
          img: require("../assets/chanpin.png"),
          imgA: require("../assets/chanpinA.png"),
        },
        {
          img: require("../assets/yuangong.png"),
          imgA: require("../assets/yuangongA.png"),
        },
        {
          img: require("../assets/fenxi.png"),
          imgA: require("../assets/fenxiA.png"),
        },
        {
          img: require("../assets/shuoyuan.png"),
          imgA: require("../assets/shuoyuanA.png"),
        },
        {
          img: require("../assets/qita.png"),
          imgA: require("../assets/qitaA.png"),
        },
        {
          img: require("../assets/guanli.png"),
          imgA: require("../assets/guanliA.png"),
        },
        {
          img: require("../assets/xiugai2.png"),
          imgA: require("../assets/xiugaip.png"),
        },
      ],
      // 接口数据
      userName: "",
      token: "",
      showCheck:false,
      style:'',
    };
  },
  methods: {
    // 左边导航栏点击事件
    handleOpen(key, keyPath) {
      let that = this;
      console.log(key, keyPath);
      that.showActiveImg = key;
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
      let that = this;
      console.log(key, keyPath);
      that.showActiveImg = "";
    },
    handselect(index, indexPath) {
      let that = this;
      //选中激活状态
      // console.log(index, indexPath);
      console.log(indexPath[0]);
      that.style = 'color: #fff !important;border-radius: 6px !important;font-weight: bold !important;background: #409eff !important;'

      that.$nextTick(function () {
        // DOM 更新了
        that.showActiveImg = indexPath[0];
        sessionStorage.setItem("indexShow", that.showActiveImg);
      });
    },
    // show(e){
    //   console.log(e)
    // }
    outLogin() {
      let that = this;
      localStorage.setItem("token", "");
      // localStorage.setItem("UserName", "");
      sessionStorage.setItem("indexShow", "");
      that.$router.push("../login");
    },
  },
  mounted() {
    console.log('base');
    let that = this;
    //   console.log(that.data)
    // console.log(that.iconImg)
    that.userName = localStorage.getItem("UserName");
    that.token = localStorage.getItem("token");
    // console.log(that.token)
    let index = sessionStorage.getItem("indexShow");
    // console.log(index);
    if (index) {
      that.showActiveImg = index;
    } else {
      that.showActiveImg = 1;
    }

    if(that.userName=='邵琳'){
      // that.showCheck = true;
    }
    else{
      // that.showCheck = false;
    }


    // 页面刷新回到首页
    // that.$router.push("./home");
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
}

.logo h1 {
  margin-left: 10px;
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

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  background-color: #2c3e50;
  overflow-y: auto;
}

.el-menu-vertical {
  border-right: none;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5;
}

.el-menu-item, .el-submenu__title {
  height: 50px;
  line-height: 50px;
}

.el-menu-item:hover, .el-submenu__title:hover {
  background-color: #34495e !important;
}

.el-menu-item.is-active {
  background-color: #42b983 !important;
  color: #fff !important;
}
</style>
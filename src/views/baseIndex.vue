<template>
  <div class="admin-layout">
    <Header />
    <div class="main-container">
      <aside class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          @select="handleSelect"
          router
          background-color="#2c3e50"
          text-color="#fff"
          active-text-color="#42b983"
        >
          <el-menu-item index="/home">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/user">
            <i class="el-icon-s-custom"></i>
            <span>账号管理</span>
          </el-menu-item>
          <el-menu-item index="/group">
            <i class="el-icon-s-cooperation"></i>
            <span>群聊管理</span>
          </el-menu-item>
          <el-menu-item index="/key">
            <i class="el-icon-s-opportunity"></i>
            <span>关键词管理</span>
          </el-menu-item>
          <el-menu-item index="/info">
            <i class="el-icon-s-order"></i>
            <span>登记管理</span>
          </el-menu-item>
          <el-menu-item index="/setting">
            <i class="el-icon-s-tools"></i>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </aside>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue';

export default {
  name: 'BaseIndex',
  components: {
    Header,
  },
  data() {
    return {
      activeMenu: '/home',
    };
  },
  methods: {
    handleSelect(index) {
      this.activeMenu = index;
    },
  },
  mounted() {
    this.activeMenu = this.$route.path;
  },
  watch: {
    $route(to) {
      this.activeMenu = to.path;
    },
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
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

.el-menu-item {
  height: 50px;
  line-height: 50px;
}

.el-menu-item:hover {
  background-color: #34495e !important;
}

.el-menu-item.is-active {
  background-color: #42b983 !important;
  color: #fff !important;
}
</style>
<template>
  <div v-loading="loading" class="user-management">
    <!-- 头部搜索 -->
    <div class="management-header">
      <el-input
        v-model="searchUsername"
        placeholder="用户名"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
      </el-input>
      <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>
    </div>

    <!-- 用户表格 -->
    <el-table
      :data="userList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      style="width: 100%"
      border
    >
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="userName" label="用户名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="role" label="角色" width="100"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button @click="editUser(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="showChangePasswordDialog(scope.row)" type="text" size="small">修改密码</el-button>
          <el-button @click="deleteUser(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      :total="userList.length"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      @change="handlePageChange"
    />

    <!-- 添加/编辑用户对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-form :model="userForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="dialogTitle === '添加用户'">
          <el-input v-model="userForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="用户" value="user"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUserForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="passwordDialogVisible" width="30%">
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="passwordForm.confirmPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPasswordChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUsers, findUserByName, updateUser, deleteUser, registerUser } from '@/api';
import Pagination from '@/components/common/Pagination.vue';

export default {
  name: 'UserManagement',
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      searchUsername: '',
      userList: [],
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false,
      passwordDialogVisible: false,
      dialogTitle: '',
      userForm: {
        id: null,
        userName: '',
        password: '',
        email: '',
        role: ''
      },
      passwordForm: {
        userId: null,
        newPassword: '',
        confirmPassword: ''
      },
      editMode: false
    };
  },
  methods: {
    async getAllUsers() {
      this.loading = true;
      try {
        const response = await getAllUsers();
        if (response.data.code === 2000) {
          this.userList = response.data.data;
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('获取用户列表失败:', error);
        this.$message.error('获取用户列表失败');
      } finally {
        this.loading = false;
      }
    },
    async searchUser() {
      if (!this.searchUsername) {
        await this.getAllUsers();
        return;
      }
      this.loading = true;
      try {
        const response = await findUserByName(this.searchUsername);
        if (response.data.code === 2000) {
          this.userList = [response.data.data];
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('搜索用户失败:', error);
        this.$message.error('搜索用户失败');
      } finally {
        this.loading = false;
      }
    },
    showChangePasswordDialog(user) {
      this.passwordForm.userId = user.id;
      this.passwordForm.newPassword = '';
      this.passwordForm.confirmPassword = '';
      this.passwordDialogVisible = true;
    },
    async submitPasswordChange() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.$message.error('两次输入的密码不一致');
        return;
      }

      try {
        const response = await updateUser(this.passwordForm.userId, {
          newPassword: this.passwordForm.newPassword
        });
        if (response.data.code === 2000) {
          this.$message.success('密码修改成功');
          this.passwordDialogVisible = false;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('修改密码失败:', error);
        this.$message.error(error.message || '修改密码失败');
      }
    },
    editUser(user) {
      this.dialogTitle = '编辑用户';
      this.userForm = { ...user };
      this.dialogVisible = true;
      this.editMode = true;
    },
    async deleteUser(user) {
      try {
        await this.$confirm('确认删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        const response = await deleteUser(user.id);
        if (response.data.code === 2000) {
          this.$message.success('用户已删除');
          await this.getAllUsers();
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除用户失败:', error);
          this.$message.error(error.message || '删除用户失败');
        }
      }
    },
    async submitUserForm() {
      try {
        if (this.editMode) {
          const response = await updateUser(this.userForm.id, this.userForm);
          if (response.data.code === 2000) {
            this.$message.success('用户信息已更新');
          } else {
            throw new Error(response.data.message);
          }
        } else {
          const response = await registerUser(this.userForm);
          if (response.data.code === 2000) {
            this.$message.success('添加用户成功');
          } else {
            throw new Error(response.data.message);
          }
        }
        this.dialogVisible = false;
        await this.getAllUsers();
      } catch (error) {
        console.error('操作失败:', error);
        this.$message.error(error.message || '操作失败');
      } finally {
        this.editMode = false;
      }
    },
    showAddUserDialog() {
      this.dialogTitle = '添加用户';
      this.userForm = {
        id: null,
        userName: '',
        password: '',
        email: '',
        role: ''
      };
      this.dialogVisible = true;
    },
    handlePageChange() {
      // 当页码改变时，可能需要重新获取数据
      // 如果是前端分页，这里可以不做任何操作
    }
  },
  mounted() {
    this.getAllUsers();
  }
};
</script>

<style scoped>
.user-management {
  padding: 20px;
}
.management-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.input-with-select {
  width: 300px;
}
</style>
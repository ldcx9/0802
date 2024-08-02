<template>
  <div class="registration-info-management">
    <h2>登记信息管理</h2>

    <!-- 搜索和筛选 -->
    <div class="management-header">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索登记信息"
        class="input-with-select"
        @keyup.enter.native="searchRegistrations"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchRegistrations"></el-button>
      </el-input>
      <el-select v-model="isResolved" placeholder="解决状态" @change="getRegistrations">
        <el-option label="全部" :value="null"></el-option>
        <el-option label="已解决" :value="true"></el-option>
        <el-option label="未解决" :value="false"></el-option>
      </el-select>
      <el-switch
        v-model="sortByCreatedTimeDesc"
        active-text="创建时间降序"
        inactive-text="创建时间升序"
        @change="getRegistrations"
      ></el-switch>
    </div>

    <!-- 登记信息列表 -->
    <el-table :data="registrationList" style="width: 100%" border fit>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="keyText" label="关键词" min-width="120"></el-table-column>
      <el-table-column prop="customReply" label="自定义回复" min-width="120"></el-table-column>
      <el-table-column prop="creatTime" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="groupName" label="地区" min-width="120"></el-table-column>
      <el-table-column prop="companyName" label="公司名称" min-width="120"></el-table-column>
      <el-table-column prop="isOk" label="是否解决" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isOk ? 'success' : 'danger'">
            {{ scope.row.isOk ? '已解决' : '未解决' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button @click="updateStatus(scope.row)" type="text" size="small">
            {{ scope.row.isOk ? '标记未解决' : '标记已解决' }}
          </el-button>
          <el-button @click="showUpdateRemarkDialog(scope.row)" type="text" size="small">更新备注</el-button>
          <el-button @click="deleteRegistration(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :pager-count="5"
        :hide-on-single-page="false"
      >
      </el-pagination>
    </div>

    <!-- 更新备注对话框 -->
    <el-dialog title="更新备注" :visible.sync="updateRemarkDialogVisible" width="30%">
      <el-form :model="updateRemarkForm">
        <el-form-item label="备注">
          <el-input v-model="updateRemarkForm.remark" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateRemarkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRemark">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';

const baseURL = 'http://106.55.225.211:81';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  data() {
    return {
      searchKeyword: '',
      registrationList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isResolved: null,
      sortByCreatedTimeDesc: true,
      updateRemarkDialogVisible: false,
      updateRemarkForm: {
        id: null,
        remark: ''
      },
      hasMoreData: true
    };
  },
  methods: {
    async getRegistrations() {
      if (!this.hasMoreData && this.currentPage > 1) {
        this.currentPage--;
        return;
      }

      try {
        const response = await axiosInstance.get('/api/Qus/GetPage', {
          params: {
            pageIndex: this.currentPage,
            pageSize: this.pageSize,
            isResolved: this.isResolved,
            sortByCreatedTimeDesc: this.sortByCreatedTimeDesc
          }
        });
        if (response.data.code === 2000) {
          if (response.data.data.length === 0) {
            this.hasMoreData = false;
            if (this.currentPage > 1) {
              this.currentPage--;
            }
            this.$message.info('没有更多数据了');
          } else {
            this.registrationList = response.data.data;
            this.total = (this.currentPage * this.pageSize) + (response.data.data.length === this.pageSize ? this.pageSize : 0);
            this.hasMoreData = response.data.data.length === this.pageSize;
          }
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('获取登记信息列表失败:', error);
        this.$message.error('获取登记信息列表失败');
      }
    },
    searchRegistrations() {
      // 实现搜索功能，可能需要后端支持
      this.$message.info('搜索功能需要后端支持');
      this.getRegistrations();
    },
    async updateStatus(row) {
      try {
        const response = await axiosInstance.patch(`/api/Qus/UpdateStatus?id=${row.id}&isOk=${!row.isOk}`);
        if (response.data.code === 2000) {
          this.$message.success('状态已更新');
          this.getRegistrations();
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('更新状态失败:', error);
        this.$message.error('更新状态失败');
      }
    },
    showUpdateRemarkDialog(row) {
      this.updateRemarkForm.id = row.id;
      this.updateRemarkForm.remark = row.remark;
      this.updateRemarkDialogVisible = true;
    },
    async updateRemark() {
      try {
        const response = await axiosInstance.patch(`/api/Qus/UpdateRemark?id=${this.updateRemarkForm.id}`, JSON.stringify(this.updateRemarkForm.remark), {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.data.code === 2000) {
          this.$message.success('备注已更新');
          this.updateRemarkDialogVisible = false;
          this.getRegistrations();
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('更新备注失败:', error);
        this.$message.error('更新备注失败');
      }
    },
    async deleteRegistration(id) {
      try {
        await this.$confirm('确认删除该登记信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const response = await axiosInstance.delete(`/api/Qus/Delete?id=${id}`);
        if (response.data.code === 2000 && response.data.data.isSuccess) {
          this.$message.success('登记信息已删除');
          this.getRegistrations();
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除登记信息失败:', error);
          this.$message.error(error.message || '删除登记信息失败');
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.hasMoreData = true;
      this.getRegistrations();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getRegistrations();
    }
  },
  mounted() {
    this.getRegistrations();
  }
};
</script>

<style scoped>
.registration-info-management {
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

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.el-dialog__body {
  max-height: 60vh;
  overflow-y: auto;
}

.el-table {
  width: 100% !important;
}

.el-table .cell {
  white-space: nowrap;
}

.el-dialog .el-form-item {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}

.el-dialog__header {
  background-color: #f5f7fa;
  padding: 15px 20px;
}

.el-dialog__title {
  font-weight: bold;
}

.el-button--text {
  margin-right: 10px;
}

.el-switch {
  margin-left: 10px;
}
</style>
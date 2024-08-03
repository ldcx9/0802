<template>
  <div class="system-settings">
    <el-card class="settings-card">
      <div slot="header" class="card-header">
        <span>系统设置</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="getConfig">刷新</el-button>
      </div>
      <el-form :model="configForm" label-width="120px" :rules="rules" ref="configForm">
        <el-form-item label="系统状态">
          <el-switch
            v-model="configForm.isOpen"
            active-text="开启"
            inactive-text="关闭"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="客服名称" prop="customerName">
          <el-input v-model="configForm.customerName" placeholder="请输入客服名称"></el-input>
        </el-form-item>
        <el-form-item label="超时时间(分钟)" prop="timeOutMinute">
          <el-input-number v-model="configForm.timeOutMinute" :min="1" :max="60"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('configForm')">保存设置</el-button>
          <el-button @click="resetForm('configForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getConfig, updateConfig } from '@/api';

export default {
  name: 'SystemSettings',
  data() {
    return {
      configForm: {
        id: 0,
        isOpen: false,
        customerName: '',
        timeOutMinute: 3
      },
      rules: {
        customerName: [
          { required: true, message: '请输入客服名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        timeOutMinute: [
          { required: true, message: '请输入超时时间', trigger: 'blur' },
          { type: 'number', min: 1, max: 60, message: '超时时间必须在1到60分钟之间', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    async getConfig() {
      try {
        const response = await getConfig();
        if (response.data.code === 2000) {
          this.configForm = response.data.data;
          this.$message.success('配置信息已刷新');
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('获取配置信息失败:', error);
        this.$message.error('获取配置信息失败');
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const response = await updateConfig(this.configForm);
            if (response.data.code === 2000) {
              this.$message.success('配置已更新');
              this.getConfig(); // 重新获取配置以确保显示最新数据
            } else {
              this.$message.error(response.data.message);
            }
          } catch (error) {
            console.error('更新配置失败:', error);
            this.$message.error('更新配置失败');
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getConfig(); // 重新获取配置以恢复原始数据
    }
  },
  mounted() {
    this.getConfig();
  }
};
</script>

<style scoped>
.system-settings {
  padding: 20px;
}

.settings-card {
  max-width: 600px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
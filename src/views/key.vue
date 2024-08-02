<template>
  <div class="keyword-reply-management">
    <h2>关键词回复管理</h2>

    <!-- 搜索和添加 -->
    <div class="management-header">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索关键词"
        class="input-with-select"
        @keyup.enter.native="searchKeywordReply"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchKeywordReply"></el-button>
      </el-input>
      <el-button type="primary" @click="showAddDialog">添加关键词回复</el-button>
    </div>

    <!-- 关键词回复列表 -->
    <el-table :data="keywordReplyList" style="width: 100%" border fit>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="keyText" label="检测关键词" min-width="120"></el-table-column>
      <el-table-column prop="isAccurate" label="精准匹配" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isAccurate ? 'success' : 'info'">
            {{ scope.row.isAccurate ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isOpen" label="是否开启" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isOpen ? 'success' : 'danger'">
            {{ scope.row.isOpen ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isSpeacalQus" label="特殊问题" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSpeacalQus ? 'warning' : 'info'">
            {{ scope.row.isSpeacalQus ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="问题回复" min-width="200">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="400"
            trigger="click">
            <div v-for="(info, index) in scope.row.keyWordInfos" :key="index" class="reply-info">
              <strong>类型:</strong> {{ getTypeText(info.type) }}<br>
              <strong>内容:</strong> 
              <span v-if="info.type === 1">{{ info.text }}</span>
              <el-image 
                v-else-if="info.type === 2" 
                style="width: 100px; height: 100px" 
                :src="info.text" 
                fit="cover"
                :preview-src-list="[info.text]">
              </el-image>
              <span v-else-if="info.type === 3">文件: {{ getFileName(info.text) }}</span>
            </div>
            <el-button slot="reference" size="small">查看回复</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="creatTime" label="创建时间" width="180"></el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button @click="editKeywordReply(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteKeywordReply(scope.row.id)" type="text" size="small">删除</el-button>
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
      >
      </el-pagination>
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%">
      <el-form :model="keywordReplyForm" label-width="120px" class="keyword-reply-form">
        <el-form-item label="检测关键词">
          <el-input v-model="keywordReplyForm.keyText"></el-input>
        </el-form-item>
        <el-form-item label="精准匹配">
          <el-switch v-model="keywordReplyForm.isAccurate"></el-switch>
        </el-form-item>
        <el-form-item label="是否开启">
          <el-switch v-model="keywordReplyForm.isOpen"></el-switch>
        </el-form-item>
        <el-form-item label="问题回复">
          <el-button @click="addKeyWordInfo('keyWordInfos')" type="primary" size="small">添加回复</el-button>
          <div v-for="(info, index) in keywordReplyForm.keyWordInfos" :key="index" class="reply-item">
            <el-select v-model="info.type" placeholder="类型" style="width: 120px;">
              <el-option label="文字" :value="1"></el-option>
              <el-option label="图片" :value="2"></el-option>
              <el-option label="文件" :value="3"></el-option>
            </el-select>
            <el-input v-if="info.type === 1" v-model="info.text" placeholder="内容"></el-input>
            <el-upload
              v-else
              class="upload-demo"
              :action="uploadUrl"
              :on-success="(res) => handleUploadSuccess(res, info)"
              :show-file-list="false"
              :headers="uploadHeaders"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-button @click="removeKeyWordInfo('keyWordInfos', index)" type="danger" icon="el-icon-delete" circle></el-button>
            <el-image
              v-if="info.type === 2 && info.text"
              style="width: 100px; height: 100px"
              :src="info.text"
              fit="cover"
            ></el-image>
            <div v-if="info.type === 3 && info.text">
              文件: {{ getFileName(info.text) }}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="回复完问题选择">
          <el-button @click="addKeyWordTwoInfo" type="primary" size="small">添加选择</el-button>
          <div v-for="(info, index) in keywordReplyForm.keyWordTwoInfos" :key="index" class="two-reply-item">
            <el-input v-model="info.key" placeholder="选择关键词"></el-input>
            <el-button @click="addKeyWordInfo('keyWordTwoInfos', index)" type="primary" size="small">添加回复</el-button>
            <div v-for="(subInfo, subIndex) in info.text" :key="subIndex" class="reply-item">
              <el-select v-model="subInfo.type" placeholder="类型" style="width: 120px;">
                <el-option label="文字" :value="1"></el-option>
                <el-option label="图片" :value="2"></el-option>
                <el-option label="文件" :value="3"></el-option>
              </el-select>
              <el-input v-if="subInfo.type === 1" v-model="subInfo.text" placeholder="内容"></el-input>
              <el-upload
                v-else
                class="upload-demo"
                :action="uploadUrl"
                :on-success="(res) => handleUploadSuccess(res, subInfo)"
                :show-file-list="false"
                :headers="uploadHeaders"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <el-button @click="removeKeyWordInfo('keyWordTwoInfos', index, subIndex)" type="danger" icon="el-icon-delete" circle></el-button>
              <el-image
                v-if="subInfo.type === 2 && subInfo.text"
                style="width: 100px; height: 100px"
                :src="subInfo.text"
                fit="cover"
              ></el-image>
              <div v-if="subInfo.type === 3 && subInfo.text">
                文件: {{ getFileName(subInfo.text) }}
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="是否特殊问题">
          <el-switch v-model="keywordReplyForm.isSpeacalQus"></el-switch>
        </el-form-item>
        <template v-if="keywordReplyForm.isSpeacalQus">
          <el-form-item label="二次回复关键词">
            <el-input v-model="keywordReplyForm.replyKey"></el-input>
          </el-form-item>
          <el-form-item label="二次回复内容">
            <el-button @click="addKeyWordInfo('speacalkeyWordTwoInfos')" type="primary" size="small">添加回复</el-button>
            <div v-for="(info, index) in keywordReplyForm.speacalkeyWordTwoInfos" :key="index" class="reply-item">
              <el-select v-model="info.type" placeholder="类型" style="width: 120px;">
                <el-option label="文字" :value="1"></el-option>
                <el-option label="图片" :value="2"></el-option>
                <el-option label="文件" :value="3"></el-option>
              </el-select>
              <el-input v-if="info.type === 1" v-model="info.text" placeholder="内容"></el-input>
              <el-upload
                v-else
                class="upload-demo"
                :action="uploadUrl"
                :on-success="(res) => handleUploadSuccess(res, info)"
                :show-file-list="false"
                :headers="uploadHeaders"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <el-button @click="removeKeyWordInfo('speacalkeyWordTwoInfos', index)" type="danger" icon="el-icon-delete" circle></el-button>
              <el-image
                v-if="info.type === 2 && info.text"
                style="width: 100px; height: 100px"
                :src="info.text"
                fit="cover"
              ></el-image>
              <div v-if="info.type === 3 && info.text">
                文件: {{ getFileName(info.text) }}
              </div>
            </div>
          </el-form-item>
          <el-form-item label="登记触发关键词">
            <el-tag
              :key="tag"
              v-for="tag in keywordReplyForm.keyCheck"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新关键词</el-button>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitKeywordReply">确 定</el-button>
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
      loading: false,
      searchKeyword: '',
      keywordReplyList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogTitle: '',
      keywordReplyForm: {
        id: 0,
        isAccurate: false,
        isOpen: true,
        keyText: '',
        keyWordInfos: [],
        keyWordTwoInfos: [],
        isSpeacalQus: false,
        replyKey: '',
        speacalkeyWordTwoInfos: [],
        keyCheck: []
      },
      inputVisible: false,
      inputValue: '',
      uploadUrl: `${baseURL}/api/File/Upload`,
      uploadHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  },
  methods: {
    async getAllKeywordReplies() {
      try {
        const response = await axiosInstance.get(`/api/KeyWordReply/GetAllKeyWordReplyLimitPage?pageIndex=${this.currentPage}&pageSize=${this.pageSize}`);
        if (response.data.code === 2000) {
          this.keywordReplyList = response.data.data;
          this.total = response.data.data.length; // 这里可能需要根据实际返回的数据结构进行调整
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('获取关键词回复列表失败:', error);
        this.$message.error('获取关键词回复列表失败');
      }
    },
    async searchKeywordReply() {
      try {
        const response = await axiosInstance.get(`/api/KeyWordReply/GetAllKeyWordReplyLink?name=${this.searchKeyword}`);
        if (response.data.code === 2000) {
          this.keywordReplyList = response.data.data;
          this.total = response.data.data.length;
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('搜索关键词回复失败:', error);
        this.$message.error('搜索关键词回复失败');
      }
    },
    getTypeText(type) {
      switch(type) {
        case 1: return '文字';
        case 2: return '图片';
        case 3: return '文件';
        default: return '未知';
      }
    },

    handleUploadSuccess(response, info) {
      if (response.code === 2000) {
        info.text = response.data;
        this.$message.success('上传成功');
      } else {
        this.$message.error('上传失败');
      }
    },
    getFileName(path) {
      return path.split('/').pop();
    },
    getContentPreview(info) {
      if (!info) return '无内容';
      switch(info.type) {
        case 1: return info.text;
        case 2: return '图片';
        case 3: return `文件: ${this.getFileName(info.text)}`;
        default: return '未知内容';
      }
    },

    beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isAudio = file.type.startsWith('audio/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage && !isAudio) {
        this.$message.error('上传文件只能是图片或音频格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!');
        return false;
      }
      return true;
    },

    showAddDialog() {
      this.dialogTitle = '添加关键词回复';
      this.keywordReplyForm = {
        id: 0,
        isAccurate: false,
        isOpen: true,
        keyText: '',
        keyWordInfos: [],
        keyWordTwoInfos: [],
        isSpeacalQus: false,
        replyKey: '',
        speacalkeyWordTwoInfos: [],
        keyCheck: []
      };
      this.dialogVisible = true;
    },
    editKeywordReply(row) {
      this.dialogTitle = '编辑关键词回复';
      this.keywordReplyForm = { ...row };
      this.dialogVisible = true;
    },
    async deleteKeywordReply(id) {
      try {
        await this.$confirm('确认删除该关键词回复?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const response = await axiosInstance.delete(`/api/KeyWordReply/DeleteKeyWordReply?id=${id}`);
        if (response.data.code === 2000 && response.data.data.isSuccess) {
          this.$message.success('关键词回复已删除');
          await this.getAllKeywordReplies();
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除关键词回复失败:', error);
          this.$message.error(error.message || '删除关键词回复失败');
        }
      }
    },
    async submitKeywordReply() {
      try {
        let response;
        if (this.keywordReplyForm.id === 0) {
          response = await axiosInstance.post('/api/KeyWordReply/AddKeyWordReply', this.keywordReplyForm);
        } else {
          response = await axiosInstance.post('/api/KeyWordReply/UpdateKeyWordReply', this.keywordReplyForm);
        }
        if (response.data.code === 2000) {
          this.$message.success(this.keywordReplyForm.id === 0 ? '添加成功' : '更新成功');
          this.dialogVisible = false;
          await this.getAllKeywordReplies();
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('操作失败:', error);
        this.$message.error(error.message || '操作失败');
      }
    },
    addKeyWordInfo(target, index) {
      const newInfo = { type: 0, text: '' };
      if (target === 'keyWordTwoInfos') {
        this.keywordReplyForm[target][index].text.push(newInfo);
      } else {
        this.keywordReplyForm[target].push(newInfo);
      }
    },
    removeKeyWordInfo(target, index, subIndex) {
      if (subIndex !== undefined) {
        this.keywordReplyForm[target][index].text.splice(subIndex, 1);
      } else {
        this.keywordReplyForm[target].splice(index, 1);
      }
    },
    addKeyWordTwoInfo() {
      this.keywordReplyForm.keyWordTwoInfos.push({ key: '', text: [] });
    },
    handleClose(tag) {
      this.keywordReplyForm.keyCheck.splice(this.keywordReplyForm.keyCheck.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },  handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.keywordReplyForm.keyCheck.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getAllKeywordReplies();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllKeywordReplies();
    },
    resetForm() {
      this.keywordReplyForm = {
        id: 0,
        isAccurate: false,
        isOpen: true,
        keyText: '',
        keyWordInfos: [],
        keyWordTwoInfos: [],
        isSpeacalQus: false,
        replyKey: '',
        speacalkeyWordTwoInfos: [],
        keyCheck: []
      };
    }
  },
  mounted() {
    this.getAllKeywordReplies();
  }
};
</script>
<style scoped>
.keyword-reply-management {
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

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.keyword-reply-form .el-form-item {
  margin-bottom: 22px;
}

.reply-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.reply-item .el-select {
  margin-right: 10px;
}

.reply-item .el-input {
  margin-right: 10px;
}

.reply-item .el-button {
  margin-left: 10px;
}

.two-reply-item {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.two-reply-item .el-input {
  margin-bottom: 10px;
}

.el-image {
  margin-top: 10px;
}

audio {
  margin-top: 10px;
}

.el-dialog__body {
  max-height: 60vh;
  overflow-y: auto;
}

.el-popover {
  max-width: 300px;
}

.el-popover p {
  margin: 5px 0;
}
</style>
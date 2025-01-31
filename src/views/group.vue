<template>
  <div class="group-chat-management">
    <h2>群聊管理</h2>

    <!-- 搜索和更新按钮 -->
    <div class="management-header">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索群聊"
        class="input-with-select"
        @keyup.enter.native="searchGroups"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchGroups"></el-button>
      </el-input>
      <div>
        <el-button type="primary" @click="updateGroupInfo">更新群聊信息</el-button>
        <el-button icon="el-icon-refresh" @click="refreshGroupList">刷新</el-button>
      </div>
    </div>

    <!-- 群聊列表 -->
    <el-table :data="groupList" style="width: 100%" border fit>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="groupName" label="群聊名称" min-width="120"></el-table-column>
      <el-table-column prop="reMark" label="备注" min-width="120"></el-table-column>
      <el-table-column prop="creatUserName" label="创建者用户名" min-width="120"></el-table-column>
      <el-table-column prop="creatNickName" label="创建者昵称" min-width="120"></el-table-column>
      <el-table-column prop="isOpen" label="是否开启" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isOpen"
            @change="(val) => updateGroupStatus(scope.row.groupId, val)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="memberCount" label="成员数量" width="100"></el-table-column>
      <el-table-column prop="areas" label="公司地区" min-width="120"></el-table-column>
      <el-table-column prop="companyName" label="公司名称" min-width="120"></el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button @click="showGroupMembers(scope.row)" type="text" size="small">查看成员</el-button>
          <el-button @click="showUpdateAreasDialog(scope.row)" type="text" size="small">更新地区</el-button>
          <el-button @click="showUpdateCompanyDialog(scope.row)" type="text" size="small">更新公司</el-button>
          <el-button @click="showAddHeadPersonDialog(scope.row)" type="text" size="small">添加负责人</el-button>
          <el-button @click="updateGroupMembers(scope.row.groupName)" type="text" size="small">更新成员</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      :total="total"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      @change="getAllGroups"
    />

    <!-- 群成员对话框 -->
    <el-dialog title="群成员列表" :visible.sync="memberDialogVisible" width="80%">
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <el-button type="primary" @click="updateGroupMembers(currentGroup.groupId)">更新群成员</el-button>
        <el-button icon="el-icon-refresh" @click="refreshGroupMembers">刷新</el-button>
      </div>
      <el-table :data="groupMembers" style="width: 100%" border fit>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="nickName" label="昵称" min-width="120"></el-table-column>
        <el-table-column prop="roomNick" label="群昵称" min-width="120"></el-table-column>
        <el-table-column prop="userName" label="用户名" min-width="120"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
        <el-table-column label="负责人" width="100">
          <template slot-scope="scope">
            <el-tag v-if="isHeadPerson(scope.row)" type="success">是</el-tag>
            <el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button v-if="!isHeadPerson(scope.row)" @click="setHeadPerson(scope.row)" type="text" size="small">设为负责人</el-button>
            <el-button v-else @click="removeHeadPerson(scope.row)" type="text" size="small">取消负责人</el-button>
            <el-button @click="showSetWeeksDialog(scope.row)" type="text" size="small">设置工作星期</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 设置工作星期对话框 -->
    <el-dialog title="设置工作星期" :visible.sync="setWeeksDialogVisible" width="30%">
      <el-form :model="setWeeksForm">
        <el-form-item label="工作星期">
          <el-checkbox-group v-model="setWeeksForm.weeks">
            <el-checkbox :label="1">周一</el-checkbox>
            <el-checkbox :label="2">周二</el-checkbox>
            <el-checkbox :label="3">周三</el-checkbox>
            <el-checkbox :label="4">周四</el-checkbox>
            <el-checkbox :label="5">周五</el-checkbox>
            <el-checkbox :label="6">周六</el-checkbox>
            <el-checkbox :label="0">周日</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setWeeksDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateHeadPersonWeeks">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 更新地区对话框 -->
    <el-dialog title="更新公司地区" :visible.sync="updateAreasDialogVisible" width="30%">
      <el-form :model="updateAreasForm">
        <el-form-item label="公司地区">
          <el-input v-model="updateAreasForm.areas"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateAreasDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateGroupAreas">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 更新公司名称对话框 -->
    <el-dialog title="更新公司名称" :visible.sync="updateCompanyDialogVisible" width="30%">
      <el-form :model="updateCompanyForm">
        <el-form-item label="公司名称">
          <el-input v-model="updateCompanyForm.companyName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateCompanyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateGroupCompanyName">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加负责人对话框 -->
    <el-dialog title="添加群组负责人" :visible.sync="addHeadPersonDialogVisible" width="30%">
      <el-form :model="addHeadPersonForm">
        <el-form-item label="负责人用户名">
          <el-input v-model="addHeadPersonForm.userName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addHeadPersonDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addHeadPerson">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { 
  getAllGroups, 
  searchGroups, 
  updateGroupInfo, 
  updateGroupStatus, 
  getGroupInfo, 
  getAllGroupMembers, 
  addHeadPerson, 
  removeHeadPerson, 
  updateHeadPersonWeeks, 
  updateGroupMembers, 
  updateGroupAreas, 
  updateGroupCompanyName 
} from '@/api';
import Pagination from '@/components/common/Pagination.vue';

export default {
  name: 'GroupChatManagement',
  components: {
    Pagination
  },
  data() {
    return {
      searchKeyword: '',
      groupList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      memberDialogVisible: false,
      groupMembers: [],
      currentGroup: null,
      updateAreasDialogVisible: false,
      updateAreasForm: {
        groupId: '',
        areas: ''
      },
      updateCompanyDialogVisible: false,
      updateCompanyForm: {
        groupId: '',
        companyName: ''
      },
      addHeadPersonDialogVisible: false,
      addHeadPersonForm: {
        groupId: '',
        userName: ''
      },
      setWeeksDialogVisible: false,
      setWeeksForm: {
        groupId: '',
        userName: '',
        weeks: []
      }
    };
  },
  methods: {
    async getAllGroups() {
      try {
        const response = await getAllGroups(this.currentPage, this.pageSize);
        if (response.data.code === 2000) {
          this.groupList = response.data.data;
          this.total = response.data.total;
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('获取群聊列表失败:', error);
        this.$message.error('获取群聊列表失败');
      }
    },
    async searchGroups() {
      try {
        const response = await searchGroups(this.searchKeyword);
        if (response.data.code === 2000) {
          this.groupList = response.data.data;
          this.total = response.data.data.length;
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('搜索群聊失败:', error);
        this.$message.error('搜索群聊失败');
      }
    },
    async updateGroupInfo() {
      try {
        const response = await updateGroupInfo();
        if (response.data.code === 2000) {
          this.$message.success('群聊信息已更新');
          await this.getAllGroups();
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('更新群聊信息失败:', error);
        this.$message.error('更新群聊信息失败');
      }
    },
    async updateGroupStatus(groupId, isOpen) {
      try {
        const response = await updateGroupStatus(groupId, isOpen);
        if (response.data.code === 2000) {
          this.$message.success('群聊状态已更新');
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('更新群聊状态失败:', error);
        this.$message.error('更新群聊状态失败');
      }
    },
    async showGroupMembers(group) {
      this.currentGroup = group;
      try {
        const groupResponse = await getGroupInfo(group.groupId);
        if (groupResponse.data.code === 2000 && groupResponse.data.data.length > 0) {
          this.currentGroup = groupResponse.data.data[0];
        } else {
          this.$message.error('获取群组详细信息失败');
          return;
        }

        const membersResponse = await getAllGroupMembers(group.groupId);
        if (membersResponse.data.code === 2000) {
          this.groupMembers = membersResponse.data.data;
          this.memberDialogVisible = true;
        } else {
          this.$message.error(membersResponse.data.message);
        }
      } catch (error) {
        console.error('获取群成员列表失败:', error);
        this.$message.error('获取群成员列表失败');
      }
    },
    isHeadPerson(member) {
      if (!this.currentGroup || !this.currentGroup.headNickName) {
        return false;
      }
      return this.currentGroup.headNickName.some(head => head.userName === member.userName);
    },
    async setHeadPerson(member) {
      try {
        const response = await addHeadPerson(this.currentGroup.groupId, member.userName);
        if (response.data.code === 2000) {
          this.$message.success('已设为负责人');
          this.currentGroup = response.data.data;
          await this.showGroupMembers(this.currentGroup);
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('设置负责人失败:', error);
        this.$message.error('设置负责人失败');
      }
    },
    async removeHeadPerson(member) {
      try {
        const response = await removeHeadPerson(this.currentGroup.groupId, member.userName);
        if (response.data.code === 2000) {
          this.$message.success('已取消负责人');
          this.currentGroup = response.data.data;
          await this.showGroupMembers(this.currentGroup);
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('取消负责人失败:', error);
        this.$message.error('取消负责人失败');
      }
    },
    showSetWeeksDialog(member) {
      const headPerson = this.currentGroup.headNickName.find(head => head.userName === member.userName);
      this.setWeeksForm = {
        groupId: this.currentGroup.groupId,
        userName: member.userName,
        weeks: headPerson ? headPerson.weeks : []
      };
      this.setWeeksDialogVisible = true;
    },
    async updateHeadPersonWeeks() {
      try {
        const response = await updateHeadPersonWeeks(this.setWeeksForm.groupId, this.setWeeksForm.userName, this.setWeeksForm.weeks);
        if (response.data.code === 2000) {
          this.$message.success('工作星期已更新');
          this.currentGroup = response.data.data;
          this.setWeeksDialogVisible = false;
          await this.showGroupMembers(this.currentGroup);
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('更新工作星期失败:', error);
        this.$message.error('更新工作星期失败');
      }
    },
    async updateGroupMembers(groupId) {
      try {
        const response = await updateGroupMembers(groupId);
        if (response.data.code === 2000) {
          this.$message.success('群成员已更新');
          if (this.currentGroup && this.currentGroup.groupId === groupId) {
            await this.showGroupMembers(this.currentGroup);
          }
          await this.getAllGroups();
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('更新群成员失败:', error);
        this.$message.error('更新群成员失败');
      }
    },
    refreshGroupList() {
      this.getAllGroups();
    },
    refreshGroupMembers() {
      if (this.currentGroup) {
        this.showGroupMembers(this.currentGroup);
      }
    },
    showUpdateAreasDialog(row) {
      this.updateAreasForm.groupId = row.groupId;
      this.updateAreasForm.areas = row.areas;
      this.updateAreasDialogVisible = true;
    },
    async updateGroupAreas() {
      try {
        const response = await updateGroupAreas(this.updateAreasForm.groupId, this.updateAreasForm.areas);
        if (response.data.code === 2000) {
          this.$message.success('公司地区已更新');
          this.updateAreasDialogVisible = false;
          await this.refreshGroupList();
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('更新公司地区失败:', error);
        this.$message.error('更新公司地区失败');
      }
    },
    showUpdateCompanyDialog(row) {
      this.updateCompanyForm.groupId = row.groupId;
      this.updateCompanyForm.companyName = row.companyName;
      this.updateCompanyDialogVisible = true;
    },
    async updateGroupCompanyName() {
      try {
        const response = await updateGroupCompanyName(this.updateCompanyForm.groupId, this.updateCompanyForm.companyName);
        if (response.data.code === 2000) {
          this.$message.success('公司名称已更新');
          this.updateCompanyDialogVisible = false;
          await this.refreshGroupList();
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('更新公司名称失败:', error);
        this.$message.error('更新公司名称失败');
      }
    },
    showAddHeadPersonDialog(row) {
      this.addHeadPersonForm.groupId = row.id;
      this.addHeadPersonForm.userName = '';
      this.addHeadPersonDialogVisible = true;
    },
    async addHeadPerson() {
      try {
        const response = await addHeadPerson(this.addHeadPersonForm.groupId, this.addHeadPersonForm.userName);
        if (response.data.code === 2000) {
          this.$message.success('群组负责人已添加');
          this.addHeadPersonDialogVisible = false;
          await this.refreshGroupList();
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.error('添加群组负责人失败:', error);
        this.$message.error('添加群组负责人失败');
      }
    },
  },
  mounted() {
    this.getAllGroups();
  }
};
</script>
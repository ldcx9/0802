import axios from 'axios';

const baseURL = process.env.VUE_APP_API_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
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

// Auth
export const login = (userData) => api.post('/api/Auth/Login', userData);
export const getAllUsers = () => api.get('/api/Auth/GetAllUsers');
export const findUserByName = (userName) => api.get(`/api/Auth/FindByUserName?userName=${userName}`);
export const updateUser = (userId, userData) => api.put(`/api/Auth/UpdateUser/${userId}`, userData);
export const deleteUser = (userId) => api.delete(`/api/Auth/DeleteUser/${userId}`);
export const registerUser = (userData) => api.post('/api/Auth/Register', userData);

// Group
export const getAllGroups = (pageIndex, pageSize) => api.get(`/api/Group/GetAllGroupLimitPage?pageIndex=${pageIndex}&pageSize=${pageSize}`);
export const searchGroups = (name) => api.get(`/api/Group/GetAllGroupLink?name=${name}`);
export const updateGroupInfo = () => api.post('/api/Group/UpdateGroupInfo');
export const updateGroupStatus = (groupId, isOpen) => api.post(`/api/Group/UpdateGroupStatus?groupId=${groupId}&isOpen=${isOpen}`);
export const getGroupInfo = (name) => api.get(`/api/Group/GetGroupInfo?name=${name}`);
export const getAllGroupMembers = (groupId) => api.get(`/api/Group/GetAllGroupMember?groupId=${groupId}`);
export const addHeadPerson = (groupId, userName) => api.post(`/api/Group/AddHeadPerson?groupId=${groupId}&userName=${userName}`);
export const removeHeadPerson = (groupId, userName) => api.post(`/api/Group/RemoveHeadPerson?groupId=${groupId}&userName=${userName}`);
export const updateHeadPersonWeeks = (groupId, userName, weeks) => api.post(`/api/Group/UpdateHeadPersonWeeks?groupId=${groupId}&userName=${userName}`, weeks);
export const updateGroupMembers = (groupId) => api.post(`/api/Group/UpdateGroupMembers?groupId=${groupId}`);
export const updateGroupAreas = (groupId, areas) => api.post(`/api/Group/UpdateGroupAreas?groupId=${groupId}`, JSON.stringify(areas), {
  headers: { 'Content-Type': 'application/json' }
});
export const updateGroupCompanyName = (groupId, companyName) => api.post(`/api/Group/UpdateGroupCompanyName?groupId=${groupId}`, JSON.stringify(companyName), {
  headers: { 'Content-Type': 'application/json' }
});

// KeyWordReply
export const getAllKeyWordReplies = (pageIndex, pageSize) => api.get(`/api/KeyWordReply/GetAllKeyWordReplyLimitPage?pageIndex=${pageIndex}&pageSize=${pageSize}`);
export const searchKeyWordReplies = (name) => api.get(`/api/KeyWordReply/GetAllKeyWordReplyLink?name=${name}`);
export const addKeyWordReply = (data) => api.post('/api/KeyWordReply/AddKeyWordReply', data);
export const updateKeyWordReply = (data) => api.post('/api/KeyWordReply/UpdateKeyWordReply', data);
export const deleteKeyWordReply = (id) => api.delete(`/api/KeyWordReply/DeleteKeyWordReply?id=${id}`);

// Qus
export const getQusPage = (pageIndex, pageSize, isResolved, sortByCreatedTimeDesc) => api.get('/api/Qus/GetPage', {
  params: { pageIndex, pageSize, isResolved, sortByCreatedTimeDesc }
});
export const updateQusStatus = (id, isOk) => api.patch(`/api/Qus/UpdateStatus?id=${id}&isOk=${isOk}`);
export const updateQusRemark = (id, remark) => api.patch(`/api/Qus/UpdateRemark?id=${id}`, JSON.stringify(remark), {
  headers: { 'Content-Type': 'application/json' }
});
export const deleteQus = (id) => api.delete(`/api/Qus/Delete?id=${id}`);

// Config
export const getConfig = () => api.get('/api/Config/GetConfig');
export const updateConfig = (config) => api.post('/api/Config/UpdateConfig', config);

// Statistics
export const getStatistics = (startDate, endDate, area) => api.get('/api/QusInt/GetStatistics', {
  params: { startDate, endDate, area }
});

// File Upload
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/File/Upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export default api;
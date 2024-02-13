import apiClient from "./services";

export default {
    getAllGroups() {
        return apiClient.get(`/groupManagement/`);
    },
    getGroup(groupId) {
        return apiClient.get(`/groupManagement/${groupId}`);
    },
    createGroup(data) {
        return apiClient.post(`/groupManagement/${data}`);
    },
    updateGroup(groupId) {
        return apiClient.put(`/groupManagement/${groupId}`);
    },
    deleteGroup(groupId) {
        return apiClient.delete(`/groupManagement/${groupId}`);
    },
    deleteAllGroups() {
        return apiClient.delete(`/groupManagement/`);
    },
};
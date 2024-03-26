import apiClient from "./services";

export default {
    getAllGroups() {
        return apiClient.get(`/groups/`);
    },
    getGroup(groupId) {
        return apiClient.get(`/groups/${groupId}`);
    },
    getGroupWithPermissions(groupId) {
        return apiClient.get(`/groups/${groupId}?full`);
    },
    createGroup(data) {
        return apiClient.post(`/groups/`, data);
    },
    updateGroup(groupId, data) {
        return apiClient.put(`/groups/${groupId}`, data);
    },
    deleteGroup(groupId) {
        return apiClient.delete(`/groups/${groupId}`);
    },
};
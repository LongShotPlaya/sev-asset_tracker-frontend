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
    updateGroupWithPermissions(groupId) {
        return apiClient.put(`/groups/${groupId}`);
    },
    deleteGroup(groupId) {
        return apiClient.delete(`/groups/${groupId}`);
    },
};
import apiClient from "./services";

export default {
    getAllGroups() {
        return apiClient.get(`/groups/`);
    },
    getGroup(groupId) {
        return apiClient.get(`/groups/${groupId}`);
    },
    createGroup(data) {
        return apiClient.post(`/groups/${data}`);
    },
    updateGroup(groupId) {
        return apiClient.put(`/groups/${groupId}`);
    },
    deleteGroup(groupId) {
        return apiClient.delete(`/groups/${groupId}`);
    },
};
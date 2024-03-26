import apiClient from "./services";

export default {
    getAllPermissions() {
        return apiClient.get(`/permissions/`);
    },
    getPermission(id) {
        return apiClient.get(`/permissions/${id}`);
    },
    createPermission(data) {
        return apiClient.post(`/permissions/`, data);
    },
    updatePermission(id, data) {
        return apiClient.put(`/permissions/${id}`, data);
    },
    deletePermission(id) {
        return apiClient.delete(`/permissions/${id}`);
    },
};
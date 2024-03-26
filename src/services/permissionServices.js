import apiClient from "./services";

export default {
    getAllPermissions() {
        return apiClient.get(`/permissions/`);
    },
    getPermissions(id) {
        return apiClient.get(`/permissions/${id}`);
    },
    createPermissions(data) {
        return apiClient.post(`/permissions/`, data);
    },
    updatePermissions(id, data) {
        return apiClient.put(`/permissions/${id}`, data);
    },
    deletePermissions(id) {
        return apiClient.delete(`/permissions/${id}`);
    },
};
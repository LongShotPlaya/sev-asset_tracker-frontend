import apiClient from "./services";

export default {
    getAllFieldListOptions() {
        return apiClient.get(`/field-list-options/`);
    },
    getFieldListOption(id) {
        return apiClient.get(`/field-list-options/${id}`);
    },
    createFieldListOption(data) {
        return apiClient.post(`/field-list-options/`, data);
    },
    updateFieldListOption(id, data) {
        return apiClient.put(`/field-list-options/${id}`, data);
    },
    deleteFieldListOption(id) {
        return apiClient.delete(`/field-list-options/${id}`);
    },
};
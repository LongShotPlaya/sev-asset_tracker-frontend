import apiClient from "./services";

export default {
    getAllAlertTypes() {
        return apiClient.get(`/alert-types`);
    },
    getAlertType(alertId) {
        return apiClient.get(`/alert-types/${alertId}`);
    },
    createAlertType(data) {
        return apiClient.post(`/alert-types/`, data);
    },
    updateAlertType(alertId, data) {
        return apiClient.put(`/alert-types/${alertId}`, data);
    },
    deleteAlertType(alertId) {
        return apiClient.delete(`/alert-types/${alertId}`);
    },
    
}
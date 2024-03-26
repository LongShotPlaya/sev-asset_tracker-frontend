import apiClient from "./services";

export default {
    getAllAlertTypes() {
        return apiClient.get(`/alert-types/`);
    },
    getAlertTypes(alertId) {
        return apiClient.get(`/alert-types/${alertId}`);
    },
    createAlertType(data) {
        return apiClient.post(`/alert-types/`, data);
    },
    updateAlertType(alertId, data) {
        return apiClient.put(`/alert-types/${alertId}`, data);
    },
    deleteAlertTypes(alertId) {
        return apiClient.delete(`/alert-types/${alertId}`);
    },  
};

import apiClient from "./services";

export default {
    getAllAlertTypes() {
        return apiClient.get(`/alertType`);
    },
    getAlertTypes(alertId) {
        return apiClient.get(`alertType/${alertId}`);
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

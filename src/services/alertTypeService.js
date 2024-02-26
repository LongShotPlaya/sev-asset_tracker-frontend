import apiClient from "./services";

export default {
    getAllAlertTypes() {
        return apiClient.get(`/alertType`);
    },
    getAlertType(alertId) {
        return apiClient.get(`alertType/${alertId}`);
    },
    createAlertType(data) {
        return apiClient.post(`/alertType/${data}`);
    },
    updateAlertType(alertId) {
        return apiClient.put(`/alertType/${alertId}`, data);
    },
    deleteAlertType(alertId) {
        return apiClient.delete(`/alertType/${alertId}`);
    },
    
}
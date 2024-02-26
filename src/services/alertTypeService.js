import apiClient from "./services";

export default {
    getAllAlertTypes() {
        return apiClient.get(`/alertType`);
    },
    getAlertTypes(alertId) {
        return apiClient.get(`alertType/${alertId}`);
    },
    createAlertTypes(data) {
        return apiClient.post(`/alertType/${data}`);
    },
    updateAlertTypes(alertId) {
        return apiClient.put(`/alertType/${alertId}`, data);
    },
    deleteAlertTypes(alertId) {
        return apiClient.delete(`/alertType/${alertId}`);
    },  
};
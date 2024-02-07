import apiClient from "./services";

export default {
    getAllAlerts() {
        return apiClient.get(`/alertType`);
    },
    getAlert(alertId) {
        return apiClient.get(`alertType/${alertId}`);
    },
    createAlert(data) {
        return apiClient.post(`/alertType/${data}`);
    },
    updateAlert(alertId) {
        return apiClient.put(`/alertType/${alertId}`, data);
    },
    deleteAlert(alertId) {
        return apiClient.delete(`/alert/${alertId}`);
    },
    deleteAllAlerts() {
        return apiClient.delete(`/alertType`);
    }
}
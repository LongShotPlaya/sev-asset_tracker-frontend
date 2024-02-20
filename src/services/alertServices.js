import apiClient from "./services";

export default {
    getAllAlerts () {
        return apiClient.get(`/alerts`);
    },
    getAlert(alertId) {
        return apiClient.get(`/alert/${alertId}`);
    },
    createAlert(data) {
        return apiClient.post(`/alert`, data);
    },
    updateAlert(alertId, data) {
        return apiClient.put(`/alert/${alertId}`, data);
    },
    deleteAlert(alertId) {
        return apiClient.delete(`/alert/${alertId}`);
    },
    deleteAllAlerts() {
        return apiClient.delete(`/alerts`);
    },
};
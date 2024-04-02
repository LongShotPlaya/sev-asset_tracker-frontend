import apiClient from "./services";

export default {
    getAllAlerts () {
        return apiClient.get(`/alerts`);
    },
    getAlert(alertId) {
        return apiClient.get(`/alerts/${alertId}`);
    },
    createAlert(data) {
        return apiClient.post(`/alerts/`, data);
    },
    updateAlert(alertId, data) {
        return apiClient.put(`/alerts/${alertId}`, data);
    },
    deleteAlert(alertId) {
        return apiClient.delete(`/alerts/${alertId}`);
    },
};
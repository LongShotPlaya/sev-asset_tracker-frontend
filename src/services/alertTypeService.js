import apiClient from "./services";

export default {
    getAllAlertTypes() {
        return apiClient.get(`/alert-type`);
    },
    getAlertType(alertId) {
        return apiClient.get(`/alert-type/${alertId}`);
    },
    createAlertType(data) {
        return apiClient.post(`/alert-type/${data}`);
    },
    updateAlertType(alertId) {
        return apiClient.put(`/alert-type/${alertId}`, data);
    },
    deleteAlertType(alertId) {
        return apiClient.delete(`/alert-type/${alertId}`);
    },
    
}
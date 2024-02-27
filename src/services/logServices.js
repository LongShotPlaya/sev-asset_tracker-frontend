import apiClient from "./services";

export default {
    getAllLogs() {
        return apiClient.get(`/logs/`);
    },
    getLog(id) {
        return apiClient.get(`/logs/${id}`);
    },
    createLog(data) {
        return apiClient.post(`/logs/${data}`);
    },
    updateLog(id) {
        return apiClient.put(`/logs/${id}`);
    },
    deleteLog(id) {
        return apiClient.delete(`/logs/${id}`);
    },
};
import apiClient from "./services";

export default {
    getAllNotifications() {
        return apiClient.get(`/notifications/`);
    },
    getNotification(id) {
        return apiClient.get(`/notifications/${id}`);
    },
    createNotification(data) {
        return apiClient.post(`/notifications/`, data);
    },
    updateNotification(id, data) {
        return apiClient.put(`/notifications/${id}`, data);
    },
    deleteNotification(id) {
        return apiClient.delete(`/notifications/${id}`);
    },
};
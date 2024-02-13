import apiClient from "./services";

export default {
    getAllRooms() {
        return apiClient.get(`/roomManagement/`);
    },
    getRoom(roomId) {
        return apiClient.get(`/roomManagement/${roomId}`);
    },
    createRoom(data) {
        return apiClient.post(`/roomManagement/${data}`);
    },
    updateRoom(roomId) {
        return apiClient.put(`/roomManagement/${roomId}`);
    },
    deleteRoom(roomId) {
        return apiClient.delete(`/roomManagement/${roomId}`);
    },
    deleteAllRooms() {
        return apiClient.delete(`/roomManagement/`);
    },
};
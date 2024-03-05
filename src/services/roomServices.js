import apiClient from "./services";

export default {
    getAllRooms() {
        return apiClient.get(`/rooms/`);
    },
    getRoom(roomId) {
        return apiClient.get(`/rooms/${roomId}`);
    },
    createRoom(data) {
        return apiClient.post(`/rooms/`, data);
    },
    updateRoom(roomId, data) {
        return apiClient.put(`/rooms/${roomId}`, data);
    },
    deleteRoom(roomId) {
        return apiClient.delete(`/rooms/${roomId}`);
    },
};
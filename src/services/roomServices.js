import apiClient from "./services";

export default {
    getAllRooms() {
        return apiClient.get(`/rooms/`);
    },
    getRoom(roomId) {
        return apiClient.get(`/rooms/${roomId}`);
    },
    createRoom(data) {
        return apiClient.post(`/rooms/${data}`);
    },
    updateRoom(roomId) {
        return apiClient.put(`/rooms/${roomId}`);
    },
    deleteRoom(roomId) {
        return apiClient.delete(`/rooms/${roomId}`);
    },
};
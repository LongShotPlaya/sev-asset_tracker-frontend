import apiClient from "./services";

export default {
    getAllUsers() {
        return apiClient.get(`/users/`);
    },
    getUser(id) {
        return apiClient.get(`/users/${id}`);
    },
    createUser(data) {
        return apiClient.post(`/users/${data}`);
    },
    updateUser(id) {
        return apiClient.put(`/users/${id}`);
    },
    deleteUser(id) {
        return apiClient.delete(`/users/${id}`);
    },
};
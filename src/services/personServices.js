import apiClient from "./services";

export default {
    getAllPeople() {
        return apiClient.get(`/personManagement/`);
    },
    getPerson(personId) {
        return apiClient.get(`/personManagement/${personId}`);
    },
    createPerson(data) {
        return apiClient.post(`/personManagement/${data}`);
    },
    updatePerson(personId) {
        return apiClient.put(`/personManagement/${personId}`);
    },
    deletePerson(personId) {
        return apiClient.delete(`/personManagement/${personId}`);
    },
    deleteAllPeople() {
        return apiClient.delete(`/personManagement/`);
    },
};
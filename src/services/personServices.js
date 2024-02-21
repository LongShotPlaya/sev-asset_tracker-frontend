import apiClient from "./services";

export default {
    getAllPeople() {
        return apiClient.get(`/people/`);
    },
    getPerson(personId) {
        return apiClient.get(`/people/${personId}`);
    },
    createPerson(data) {
        return apiClient.post(`/people/${data}`);
    },
    updatePerson(personId) {
        return apiClient.put(`/people/${personId}`);
    },
    deletePerson(personId) {
        return apiClient.delete(`/people/${personId}`);
    },
    deleteAllPeople() {
        return apiClient.delete(`/people/`);
    },
};
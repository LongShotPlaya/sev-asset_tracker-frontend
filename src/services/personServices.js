import apiClient from "./services";

export default {
    getAllPeople() {
        return apiClient.get(`/people/`);
    },
    getPerson(personId) {
        return apiClient.get(`/people/${personId}`);
    },
    createPerson(data) {
        return apiClient.post(`/people/`, data);
    },
    updatePerson(personId, data) {
        return apiClient.put(`/people/${personId}`, data);
    },
    deletePerson(personId) {
        return apiClient.delete(`/people/${personId}`);
    },
};
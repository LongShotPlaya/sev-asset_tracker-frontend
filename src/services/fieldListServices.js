import apiClient from "./services";

export default {
    getAllFieldLists() {
        return apiClient.get(`/field-lists/`);
    },
    getOneFieldList(fieldListId) {
        return apiClient.get(`/field-lists/${fieldListId}`);
    },
    createFieldList(data) {
        return apiClient.post(`/field-lists/${data}`);
    },
    updateFieldList(fieldListId) {
        return apiClient.put(`/field-lists/${fieldListId}`);
    },
    deleteFieldList(fieldListId) {
        return apiClient.delete(`/field-lists/${fieldListId}`);
    },
};
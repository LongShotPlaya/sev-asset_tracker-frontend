import apiClient from "./services";

export default {
    getAllFieldLists() {
        return apiClient.get(`/field-lists/`);
    },
    getOneFieldList(fieldListId) {
        return apiClient.get(`/field-list/${fieldListId}`);
    },
    createFieldList(data) {
        return apiClient.post(`/field-list/${data}`);
    },
    updateFieldList(fieldListId) {
        return apiClient.put(`/field-list/${fieldListId}`);
    },
    deleteFieldList(fieldListId) {
        return apiClient.delete(`/field-list/${fieldListId}`);
    },
};
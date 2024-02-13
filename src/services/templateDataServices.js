import apiClient from "./services";

export default {
    getAllTemplateData() {
        return apiClient.get(`/templateDataManagement/`);
    },
    getTemplateData(templateId) {
        return apiClient.get(`/templateDataManagement/${templateId}`);
    },
    creaTemplateData(data) {
        return apiClient.post(`/templateDataManagement/${data}`);
    },
    updateTemplateData(templateId) {
        return apiClient.put(`/templateDataManagement/${templateId}`);
    },
    deleteTemplateData(templateId) {
        return apiClient.delete(`/templateDataManagement/${templateId}`);
    },
    deleteAllTemplateData() {
        return apiClient.delete(`/templateDataManagement/`);
    },
};
import apiClient from "./services";

export default {
    getAllTemplateData() {
        return apiClient.get(`/templateData/`);
    },
    getTemplateData(templateId) {
        return apiClient.get(`/templateData/${templateId}`);
    },
    creaTemplateData(data) {
        return apiClient.post(`/templateData/${data}`);
    },
    updateTemplateData(templateId) {
        return apiClient.put(`/templateData/${templateId}`);
    },
    deleteTemplateData(templateId) {
        return apiClient.delete(`/templateData/${templateId}`);
    },
    deleteAllTemplateData() {
        return apiClient.delete(`/templateData/`);
    },
};
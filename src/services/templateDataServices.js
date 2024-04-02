import apiClient from "./services";

export default {
    getAllTemplateData() {
        return apiClient.get(`/template-data/`);
    },
    getTemplateData(templateId) {
        return apiClient.get(`/template-data/${templateId}`);
    },
    creaTemplateData(data) {
        return apiClient.post(`/template-data/`, data);
    },
    updateTemplateData(templateId, data) {
        return apiClient.put(`/template-data/${templateId}`, data);
    },
    deleteTemplateData(templateId) {
        return apiClient.delete(`/template-data/${templateId}`);
    },
};
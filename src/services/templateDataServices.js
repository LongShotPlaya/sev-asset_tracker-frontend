import apiClient from "./services";

export default {
    getAllTemplateData() {
        return apiClient.get(`/templateData/`);
    },
    getTemplateData(templateId) {
        return apiClient.get(`/templateData/${templateId}`);
    },
    creaTemplateData(data) {
        return apiClient.post(`/templateData/`, data);
    },
    updateTemplateData(templateId, data) {
        return apiClient.put(`/templateData/${templateId}`, data);
    },
    deleteTemplateData(templateId) {
        return apiClient.delete(`/templateData/${templateId}`);
    },
};
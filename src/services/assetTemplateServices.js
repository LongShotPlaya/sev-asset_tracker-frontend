import apiClient from "./services";

export default{
    getAllAssetTemplates() {
        return apiClient.get(`/assetTemplate/`);
    },
    getAssetTemplate(assetTemplateId) {
        return apiClient.get(`/assetTemplate/${assetTemplateId}`);
    },
    createAssetTemplate(data) {
        return apiClient.post(`/assetTemplate/`, data);
    },
    updateAssetTemplate(assetTemplateId, data) {
        return apiClient.put(`/assetTemplate/${assetTemplateId}`, data);
    },
    deleteAssetTemplate(assetTemplateId) {
        return apiClient.delete(`/assetTemplate/${assetTemplateId}`);
    },
};
import apiClient from "./services";

export default{
    getAllAssetTemplates() {
        return apiClient.get(`/asset-templates/`);
    },
    getAssetTemplate(assetTemplateId) {
        return apiClient.get(`/asset-templates/${assetTemplateId}`);
    },
    getFullAssetTemplate(assetTemplateId) {
        return apiClient.get(`/asset-templates/${assetTemplateId}?full`);
    },
    createAssetTemplate(data) {
        return apiClient.post(`/asset-templates/`, data);
    },
    updateAssetTemplate(assetTemplateId, data) {
        return apiClient.put(`/asset-templates/${assetTemplateId}`, data);
    },
    deleteAssetTemplate(assetTemplateId) {
        return apiClient.delete(`/asset-templates/${assetTemplateId}`);
    },
};
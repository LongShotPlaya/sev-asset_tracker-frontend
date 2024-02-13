import apiClient from "./services";

export default{
    getAllAssetTemplates() {
        return apiClient.get(`/assetTemplateManagement/`);
    },
    getAssetTemplate(assetTemplateId) {
        return apiClient.get(`/assetTemplateManagement/${assetTemplateId}`);
    },
    createAssetTemplate(data) {
        return apiClient.post(`/assetTemplateManagement/${data}`);
    },
    updateAssetTemplate(assetTemplateId) {
        return apiClient.put(`/assetTemplateManagement/${assetTemplateId}`);
    },
    deleteAssetTemplate(assetTemplateId) {
        return apiClient.delete(`/assetTemplateManagement/${assetTemplateId}`);
    },
    deleteAllTemplates() {
        return apiClient.delete(`/assetTemplateManagement/`);
    },
};
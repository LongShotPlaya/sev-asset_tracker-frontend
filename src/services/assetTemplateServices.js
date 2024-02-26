import apiClient from "./services";

export default{
    getAllAssetTemplates() {
        return apiClient.get(`/asset-templates/`);
    },
    getAssetTemplate(assetTemplateId) {
        return apiClient.get(`/asset-templates/${assetTemplateId}`);
    },
    createAssetTemplate(data) {
        return apiClient.post(`/asset-templates/${data}`);
    },
    updateAssetTemplate(assetTemplateId) {
        return apiClient.put(`/asset-templates/${assetTemplateId}`);
    },
    deleteAssetTemplate(assetTemplateId) {
        return apiClient.delete(`/asset-templates/${assetTemplateId}`);
    },
};
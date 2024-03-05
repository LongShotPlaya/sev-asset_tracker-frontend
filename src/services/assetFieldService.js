import apiClient from "./services";

export default{
    createAssetField(data) {
        return apiClient.post(`/asset-fields/`, data);
    },
    getAllAssetFields() {
        return apiClient.get(`/asset-fields/`);
    },
    getAssetField(assetFieldId) {
        return apiClient.get(`asset-fields/${assetFieldId}`);
    },
    updateAssetField(assetFieldId, data) {
        return apiClient.put(`asset-fields/${assetFieldId}`, data);
    },
    deleteAssetField(assetFieldId) {
        return apiClient.delete(`asset-fields/${assetFieldId}`);
    },
};
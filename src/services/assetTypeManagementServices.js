import apiClient from "./services";

export default {
    getAllAssetTypes() {
        return apiClient.get(`/assetType/`);
    },
    getAssetType(assetTypeId) {
        return apiClient.get(`/assetType/${assetTypeId}`);
    },
    createAssetType(data) {
        return apiClient.post(`/assetType/`, data);
    },
    updateAssetType(assetTypeId, data) {
        return apiClient.put(`/assetType/${assetTypeId}`, data);
    },
    deleteAssetType(assetTypeId) {
        return apiClient.delete(`/assetType/${assetTypeId}`);
    },
};
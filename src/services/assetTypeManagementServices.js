import apiClient from "./services";

export default {
    getAllAssetTypes() {
        return apiClient.get(`/assetType/`);
    },
    getAssetType(assetTypeId) {
        return apiClient.get(`/assetType/${assetTypeId}`);
    },
    createAssetType(data) {
        return apiClient.post(`/assetType/${data}`);
    },
    updateAssetType(assetTypeId) {
        return apiClient.put(`/assetType/${assetTypeId}`);
    },
    deleteAssetType(assetTypeId) {
        return apiClient.delete(`/assetType/${assetTypeId}`);
    },
};
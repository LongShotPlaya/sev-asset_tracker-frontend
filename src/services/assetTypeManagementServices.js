import apiClient from "./services";

export default {
    getAllAssetTypes() {
        return apiClient.get(`/asset-types/`);
    },
    getAssetType(assetTypeId) {
        return apiClient.get(`/asset-types/${assetTypeId}`);
    },
    createAssetType(data) {
        return apiClient.post(`/asset-types/`, data);
    },
    updateAssetType(assetTypeId, data) {
        return apiClient.put(`/asset-types/${assetTypeId}`, data);
    },
    deleteAssetType(assetTypeId) {
        return apiClient.delete(`/asset-types/${assetTypeId}`);
    },
};
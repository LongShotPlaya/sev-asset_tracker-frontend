import apiClient from "./services";

export default {
    getAllAssetTypes() {
        return apiClient.get(`/asset-types/`);
    },
    getAssetType(assetTypeId) {
        return apiClient.get(`/asset-types/${assetTypeId}`);
    },
    createAssetType(data) {
        return apiClient.post(`/asset-types/${data}`);
    },
    updateAssetType(assetTypeId) {
        return apiClient.put(`/asset-types/${assetTypeId}`);
    },
    deleteAssetType(assetTypeId) {
        return apiClient.delete(`/asset-types/${assetTypeId}`);
    },
};
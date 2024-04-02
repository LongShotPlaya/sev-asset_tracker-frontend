import apiClient from "./services";

export default {
    getAllAssetData() {
        return apiClient.get(`/asset-data/`);
    },
    getAssetData(assetDataId) {
        return apiClient.get(`/asset-data/${assetDataId}`);
    },
    createAssetData(data) {
        return apiClient.post(`/asset-data/`, data);
    },
    updateAssetData(assetDataId, data) {
        return apiClient.put(`/asset-data/${assetDataId}`, data);
    },
    deleteAssetData(assetDataId) {
        return apiClient.delete(`/asset-data/${assetDataId}`);
    },
};
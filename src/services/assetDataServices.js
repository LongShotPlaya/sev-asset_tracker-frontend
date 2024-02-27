import apiClient from "./services";

export default {
    getAllAssetData() {
        return apiClient.get(`/asset-data/`);
    },
    getAssetData(assetDataId) {
        return apiClient.get(`/asset-data/${assetDataId}`);
    },
    createAssetData(data) {
        return apiClient.post(`/assetData/`, data);
    },
    updateAssetData(assetDataId, data) {
        return apiClient.put(`/assetData/${assetDataId}`, data);
    },
    deleteAssetData(assetDataId) {
        return apiClient.delete(`/assetData/${assetDataId}`);
    },
};
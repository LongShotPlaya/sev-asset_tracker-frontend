import apiClient from "./services";

export default {
    getAllAssetData() {
        return apiClient.get(`/assetData/`)
    },
    getAssetData(assetDataId) {
        return apiClient.get(`/assetData/${assetDataId}`);
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
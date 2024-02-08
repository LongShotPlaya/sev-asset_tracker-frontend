import apiClient from "./services";

export default {
    getAllAssetData() {
        return apiClient.get(`/assetData/`)
    },
    getAssetData(assetDataId) {
        return apiClient.get(`/assetData/${assetDataId}`);
    },
    createAssetData(data) {
        return apiClient.post(`/assetData/${data}`);
    },
    updateAssetData(assetDataId) {
        return apiClient.put(`/assetData/${assetDataId}`);
    },
    deleteAssetData(assetDataId) {
        return apiClient.delete(`/assetData/${assetDataId}`);
    },
    deleteAllAssetData() {
        return apiClient.delete(`/assetData/`);
    },
}
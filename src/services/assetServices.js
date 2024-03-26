import apiClient from "./services.js";

export default {
    getAllAssets() {
        return apiClient.get(`/assets`);
    },
    getAsset(assetId) {
        return apiClient.get(`/assets/${assetId}`);
    },
    getFullAssetType(id) {
        return apiClient.get(`/assets/${id}?full`);
    },
    createAsset(data) {
        return apiClient.post(`/assets/`, data);
    },
    updateAsset(assetId, data) {
        return apiClient.put(`/assets/${assetId}`, data);
    },
    deleteAsset(assetId) {
        return apiClient.delete(`assets/${assetId}`);
    },
};
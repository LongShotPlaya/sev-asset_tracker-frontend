import apiClient from "./services.js";

export default {
    getAllAssets() {
        return apiClient.get(`/assets`);
    },
    getAsset(assetId) {
        return apiClient.get(`/assets/${assetId}`);
    },
    createAsset(data) {
        return apiClient.post(`/assets/${data}`);
    },
    updateAsset(assetId) {
        return apiClient.put(`/assets/${assetId}`);
    },
    deleteAsset(assetId) {
        return apiClient.delete(`assets/${assetId}`);
    },
};
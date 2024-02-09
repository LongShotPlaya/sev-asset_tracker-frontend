import apiClient from "./services.js";

export default {
    getAllAssets() {
        return apiClient.get(`/assets`);
    },
    getAsset(assetID) {
        return apiClient.get(`/assets/${assetID}`);
    },
    createAsset(data) {
        return apiClient.post(`/assets/${data}`);
    },
    updateAsset(assetID) {
        return apiClient.put(`/assets/${assetID}`);
    },
    deleteAsset(assetID) {
        return apiClient.delete(`assets/${assetID}`);
    },
    deleteAllAssets() {
        return apiClient.delete(`/assets`);
    }
};
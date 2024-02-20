import apiClient from "./services.js";

export default {
    getAllAssets() {
        return apiClient.get(`/assets`);
    },
    getAsset() {
        return apiClient.get`/assets/${assetID}`;
    },
};
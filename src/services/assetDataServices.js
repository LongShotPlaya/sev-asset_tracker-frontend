import apiClient from "./services";

export default {
    getAllAssetData() {
        return apiClient.get(`/assets/`)
    },
    getAssetData(assetId) {
        return apiClient.get(`/assets/${assetId}`);
    },
    createAssetData(data) {
        return apiClient.post(`/assets/`)
    }

}
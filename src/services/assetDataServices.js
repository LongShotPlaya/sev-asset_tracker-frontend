import apiClient from "./services";

export default {
    getAllAssetData() {
        return apiClient.get(`/asset-data/`);
    },
    getAssetData(assetDataId) {
        return apiClient.get(`/asset-data/${assetDataId}`);
    },
    createAssetData(data) {
        return apiClient.post(`/asset-data/${data}`);
    },
    updateAssetData(assetDataId) {
        return apiClient.put(`/asset-data/${assetDataId}`);
    },
    deleteAssetData(assetDataId) {
        return apiClient.delete(`/asset-data/${assetDataId}`);
    },

};
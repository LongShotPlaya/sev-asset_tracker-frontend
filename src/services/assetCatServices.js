import apiClient from "./services";

export default {
    getAllAssetCats() {
        return apiClient.get(`/assetCategory/`);
    },
    getAssetCat(assetCatId) {
        return apiClient.get(`/assetCategory/${assetCatId}`);
    },
    createAssetCat(data) {
        return apiClient.post(`/assetCategory/}`, data);
    },
    updateAssetCat(assetCatId, data) {
        return apiClient.put(`/assetCategory/${assetCatId}`, data);
    },
    deleteAssetCat(assetCatId) {
        return apiClient.delete(`/assetCategory${assetCatId}`);
    },
};
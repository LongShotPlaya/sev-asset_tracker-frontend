import apiClient from "./services";

export default {
    getAllAssetCats() {
        return apiClient.get(`/assetCategory/`);
    },
    getAssetCat(assetCatId) {
        return apiClient.get(`/assetCategory/${assetCatId}`);
    },
    createAssetCat(data) {
        return apiClient.post(`/assetCategory/${data}`);
    },
    updateAssetCat(assetCatId) {
        return apiClient.put(`/assetCategory/${assetCatId}`);
    },
    deleteAllAssetCats() {
        return apiClient.delete(`/assetCategory/`);
    },
    deleteAssetCat(assetCatId) {
        return apiClient.delete(`/assetCategory${assetCatId}`);
    },
};
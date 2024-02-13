import apiClient from "./services";

export default {
    getAllAssetCats() {
        return apiClient.get(`/assetCatManagement/`);
    },
    getAssetCat(assetCatId) {
        return apiClient.get(`/assetCatManagement/${assetCatId}`);
    },
    createAssetCat(data) {
        return apiClient.post(`/assetCatManagement/${data}`);
    },
    updateAssetCat(assetCatId) {
        return apiClient.put(`/assetCatManagement/${assetCatId}`);
    },
    deleteAllAssetCats() {
        return apiClient.delete(`/assetCatManagement/`);
    },
    deleteAssetCat(assetCatId) {
        return apiClient.delete(`/assetCatManagement${assetCatId}`);
    },
};
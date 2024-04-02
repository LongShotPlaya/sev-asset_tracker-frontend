import apiClient from "./services";

export default {
    getAllAssetCats() {
        return apiClient.get(`/asset-categories/`);
    },
    getAssetCat(assetCatId) {
        return apiClient.get(`/asset-categories/${assetCatId}`);
    },
    createAssetCat(data) {
        return apiClient.post(`/asset-categories/`, data);
    },
    updateAssetCat(assetCatId, data) {
        return apiClient.put(`/asset-categories/${assetCatId}`, data);
    },
    deleteAssetCat(assetCatId) {
        return apiClient.delete(`/asset-categories/${assetCatId}`);
    },
};
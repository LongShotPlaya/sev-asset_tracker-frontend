import apiClient from "./services";

export default {
    getAllAssetTypes() {
        return apiClient.get(`/assetTypeManagement/`);
    },
    getAssetType(assetTypeId) {
        return apiClient.get(`/assetTypeManagement/${assetTypeId}`);
    },
    createAssetType(data) {
        return apiClient.post(`/assetTypeManagement/${data}`);
    },
    updateAssetType(assetTypeId) {
        return apiClient.put(`/assetTypeManagement/${assetTypeId}`);
    },
    deleteAssetType(assetTypeId) {
        return apiClient.delete(`/assetTypeManagement/${assetTypeId}`);
    },
    deleteAllAssetTypes() {
        return apiClient.delete(`/assetTypeManagement`);
    },
};
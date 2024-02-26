import apiClient from "./services";

export default{
    createAssetField(data) {
        return apiClient.post(`/asset-fields/${data}`);
    },
    getAllAssetFields() {
        return apiClient.get(`/asset-fields/`);
    },
    getAssetField(assetFieldId) {
        return apiClient.get(`asset-fields/${assetFieldId}`);
    },
    updateAssetField(assetFieldId) {
        return apiClient.put(`asset-fields/${assetFieldId}`);
    },
    deleteAssetField(assetFieldId) {
        return apiClient.delete(`asset-fields/${assetFieldId}`);
    },
}
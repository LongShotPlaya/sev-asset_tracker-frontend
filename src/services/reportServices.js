import apiClient from "./services";

export default {
    getReportableCategories() {
        return apiClient.get(`/reporting/asset-categories`);
    },
    getReportableTypes() {
        return apiClient.get(`/reporting/asset-types`);
    },
    getAssetReport(assetTypeId, data) {
        return apiClient.post(`/reporting/asset-types/${assetTypeId}`, data);
    },
};
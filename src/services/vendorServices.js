import apiClient from "./services";

export default {
    getAllVendors() {
        return apiClient.get(`/vendorManagement/`);
    },
    getVendor(vendorId) {
        return apiClient.get(`/vendorManagement/${vendorId}`);
    },
    createVendor(data) {
        return apiClient.post(`/vendorManagement/${data}`);
    },
    updateVendor(vendorId) {
        return apiClient.put(`/vendorManagement/${vendorId}`);
    },
    deleteVendor(vendorId) {
        return apiClient.delete(`/vendorManagement/${vendorId}`);
    },
    deleteAllVendors() {
        return apiClient.delete(`/vendorManagement/`);
    },
};
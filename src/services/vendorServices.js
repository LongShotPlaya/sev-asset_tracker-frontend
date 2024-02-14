import apiClient from "./services";

export default {
    getAllVendors() {
        return apiClient.get(`/vendors/`);
    },
    getVendor(vendorId) {
        return apiClient.get(`/vendors/${vendorId}`);
    },
    createVendor(data) {
        return apiClient.post(`/vendors/${data}`);
    },
    updateVendor(vendorId) {
        return apiClient.put(`/vendors/${vendorId}`);
    },
    deleteVendor(vendorId) {
        return apiClient.delete(`/vendors/${vendorId}`);
    },
    deleteAllVendors() {
        return apiClient.delete(`/vendors/`);
    },
};
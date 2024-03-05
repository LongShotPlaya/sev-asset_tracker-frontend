import apiClient from "./services";

export default {
    getAllVendors() {
        return apiClient.get(`/vendors/`);
    },
    getVendor(vendorId) {
        return apiClient.get(`/vendors/${vendorId}`);
    },
    createVendor(data) {
        return apiClient.post(`/vendors/`, data);
    },
    updateVendor(vendorId, data) {
        return apiClient.put(`/vendors/${vendorId}`, data);
    },
    deleteVendor(vendorId) {
        return apiClient.delete(`/vendors/${vendorId}`);
    },
};
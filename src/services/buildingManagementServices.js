import apiClient from "./services";

export default{
    getAllBuildings() {
        return apiClient.get(`/buildings/`);
    },
    getBuilding(buildingId) {
        return apiClient.get(`/buildings/${buildingId}`);
    },
    createBuilding(data) {
        return apiClient.post(`/buildings/`, data);
    },
    updateBuilding(buildingId, data) {
        return apiClient.put(`/buildings/${buildingId}`, data);
    },
    deleteBuilding(buildingId) {
        return apiClient.delete(`/buildings/${buildingId}`);
    },
};
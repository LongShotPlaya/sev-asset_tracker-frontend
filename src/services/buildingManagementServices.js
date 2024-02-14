import apiClient from "./services";

export default{
    getAllBuildings() {
        return apiClient.get(`/buildings/`);
    },
    getBuilding(buildingId) {
        return apiClient.get(`/buildings/${buildingId}`);
    },
    createBuilding(data) {
        return apiClient.post(`/buildings/${data}`);
    },
    updateBuilding(buildingId) {
        return apiClient.put(`/buildings/${buildingId}`);
    },
    deleteBuilding(buildingId) {
        return apiClient.delete(`/buildings/${buildingId}`);
    },
    deleteAllBuildings() {
        return apiClient.delete(`/buildings/`);
    },
};
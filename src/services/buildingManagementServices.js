import apiClient from "./services";

export default{
    getAllBuildings() {
        return apiClient.get(`/buildingManagement/`);
    },
    getBuilding(buildingId) {
        return apiClient.get(`/buildingManagement/${buildingId}`);
    },
    createBuilding(data) {
        return apiClient.post(`/buildingManagement/${data}`);
    },
    updateBuilding(buildingId) {
        return apiClient.put(`/buildingManagement/${buildingId}`);
    },
    deleteBuilding(buildingId) {
        return apiClient.delete(`/buildingManagement/${buildingId}`);
    },
    deleteAllBuildings() {
        return apiClient.delete(`/buildingManagement/`);
    },
};
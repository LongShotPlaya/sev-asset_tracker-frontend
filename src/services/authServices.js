import apiClient from "./services.js";

export default {
  loginUser(user) {
    return apiClient.post("login", user);
  },
  authorizeUser() {
    return apiClient.post("authorize");
  },
  logoutUser(token) {
    return apiClient.post("logout", token);
  },
};

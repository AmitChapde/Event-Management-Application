import api from "./axios";

export const createProfile = (data) => api.post("/profiles", data);
export const getAllProfiles = () => api.get("/profiles");
export const getProfileById = (id) => api.get(`/profiles/${id}`);
export const updateProfileTimezone = (id, data) =>
  api.put(`/profiles/${id}`, data);

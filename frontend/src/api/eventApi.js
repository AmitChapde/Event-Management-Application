import api from "./axios";

export const createEvent = (data) => api.post("/events", data);
export const getAllEvents = () => api.get("/events");
export const getEventById = (id) => api.get(`/events/${id}`);
export const getEventsByProfileId = (profileId) =>
  api.get(`/events/profile/${profileId}/events`);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const getEventLogs = (id) => api.get(`/events/${id}/logs`);

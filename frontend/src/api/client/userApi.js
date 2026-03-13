// src/api/client/userApi.js
import api from "./apiClient";

export const fetchUsers = () => api.get("/users/staff");          // list
export const fetchUserById = (id) => api.get(`/users/staff/${id}`); // single
export const updateUser = (id, data) => api.put(`/users/staff/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/staff/${id}`);

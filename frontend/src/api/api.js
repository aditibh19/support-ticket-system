// src/api.js
import axios from "axios";
import { toast } from "react-toastify";

// Base URL for backend API
const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // MUST match login file

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Server not responding");
    } else if (error.response.status === 401) {
      toast.error("Unauthorized: Invalid token");
      localStorage.removeItem("authToken");
    }

    return Promise.reject(error);
  }
);

// ---------------------
// Ticket API Endpoints
// ---------------------

// ---------------------
// Ticket API Endpoints
// ---------------------

export const getTickets = (params = {}) =>
  api.get("/tickets/", { params }).then((res) => res.data);

export const createTicket = (data) =>
  api.post("/tickets/", data).then((res) => res.data);

export const updateTicket = (id, data) =>
  api.patch(`/tickets/${id}/`, data).then((res) => res.data);

// **Add this function**
export const deleteTicket = (id) =>
  api.delete(`/tickets/${id}/`).then((res) => res.data);

export const getStats = () =>
  api.get("/tickets/stats/").then((res) => res.data);

export const classifyTicket = async (description) => {
  try {
    const res = await api.post("/tickets/classify/", { description });
    return res.data;
  } catch (err) {
    // fallback if AI fails
    return {
      suggested_category: "general",
      suggested_priority: "medium",
    };
  }
};

export default api;
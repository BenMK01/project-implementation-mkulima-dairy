import axios from "axios";

/**
 * Central axios instance:
 * - baseURL is empty so route paths are relative and Vite will proxy /api -> Django.
 * - withCredentials true so cookies (session / CSRF) are sent.
 */
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
};

const api = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach CSRF token automatically for unsafe HTTP methods
api.interceptors.request.use((config) => {
  if (!config || !config.headers) return config;
  const csrf = getCookie("csrftoken") || getCookie("csrf");
  if (csrf) {
    config.headers["X-CSRFToken"] = csrf;
  }
  return config;
});

export default api;
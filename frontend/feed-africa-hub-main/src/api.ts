// src/api.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Helper to normalize image URLs returned by backend.
// Usage: import api, { getImageUrl } from "@/api";
export const getImageUrl = (path?: string): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
};

// NOTE: intentionally do NOT auto-redirect on 401/403 here so browsing remains optional.
// Let individual components decide whether to prompt or redirect when auth is required.

export default api;
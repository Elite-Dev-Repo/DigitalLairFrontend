import axios from "axios";
import { ACCESS, REFRESH } from "./constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let pendingQueue = [];

const refreshTokens = async () => {
  const refresh = localStorage.getItem(REFRESH);
  if (!refresh) {
    throw new Error("No refresh token available");
  }
  const response = await axios.post(`${API_URL}token/refresh/`, { refresh });
  const { access } = response.data;
  localStorage.setItem(ACCESS, access);
  if (response.data.refresh) {
    localStorage.setItem(REFRESH, response.data.refresh);
  }
  return access;
};

api.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") return config;
    const token = localStorage.getItem(ACCESS);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const canRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem(REFRESH));

    if (!canRefresh) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const token = await refreshTokens();
      pendingQueue.forEach(({ resolve }) => resolve(token));
      pendingQueue = [];
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    } catch (refreshError) {
      pendingQueue.forEach(({ reject }) => reject(refreshError));
      pendingQueue = [];
      localStorage.removeItem(ACCESS);
      localStorage.removeItem(REFRESH);
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
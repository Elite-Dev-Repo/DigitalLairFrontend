import api from "./api";
import { ACCESS, REFRESH, USER } from "./constants";

export const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  localStorage.removeItem(USER);
};

export const register = async (userData) => {
  const response = await api.post("/regsiter/", userData);
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/token/", { email, password });
  const { access, refresh } = response.data;
  const payload = decodeJWT(access);
  const user = { id: payload?.user_id ?? null, email };
  localStorage.setItem(ACCESS, access);
  localStorage.setItem(REFRESH, refresh);
  localStorage.setItem(USER, JSON.stringify(user));
  return user;
};
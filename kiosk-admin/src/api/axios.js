import axios from "axios";
import { API_BASE_URL } from "../config/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 관리자 API 요청 전에 JWT 자동 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("isAdminLoggedIn");

      if (window.location.pathname !== "/adminlogin") {
        window.location.replace("/adminlogin");
      }
    }

    return Promise.reject(error);
  },
);

export default api;

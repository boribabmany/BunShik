import axios from "axios";
import { API_BASE_URL } from "../config/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRedirectingToLogin = false;

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

// 로그인 만료 또는 권한 오류 공통 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("isAdminLoggedIn");

      if (
        window.location.pathname !== "/adminlogin" &&
        !isRedirectingToLogin
      ) {
        isRedirectingToLogin = true;
        alert("로그인 시간이 만료되었습니다. 다시 로그인해주세요.");
        window.location.replace("/adminlogin");
      }
    }

    return Promise.reject(error);
  },
);

export default api;

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("REACT_APP_API_BASE_URL 환경변수가 필요합니다.");
}

export const API_BASE_URL = apiBaseUrl.replace(/\/+$/, "");

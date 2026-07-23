import api from "./axios";

// 관리자 변경 내역 조회
export const getHistory = async () => {
  const response = await api.get("/api/admin/history");

  return response.data;
};
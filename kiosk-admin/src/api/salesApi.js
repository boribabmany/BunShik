import api from "./axios";

// 매출 요약
export const getSalesSummary = async () => {
  const response = await api.get("/api/admin/sales/summary");
  return response.data.data;
};


// 인기 메뉴 TOP5
export const getPopularMenus = async () => {
  const response = await api.get("/api/admin/sales/popular");
  return response.data.data;
};


// 매출 이력
export const getSalesHistory = async () => {
  const response = await api.get("/api/admin/sales/history");
  return response.data.data;
};
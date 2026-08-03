import { create } from "zustand";
import {
  getSalesSummary,
  getPopularMenus,
  getSalesHistory,
  getSalesAnalytics,
} from "../api/salesApi";

const useSalesStore = create((set) => ({
  // 상태
  salesSummary: null,
  popularMenus: [],
  salesHistory: [],
  salesAnalytics: null,
  isSalesAnalyticsLoading: false,
  salesAnalyticsError: null,

  // 매출 요약 조회
  loadSalesSummary: async () => {
    const data = await getSalesSummary();
    set({ salesSummary: data });
  },

  // 인기 메뉴 조회
  loadPopularMenus: async () => {
    const data = await getPopularMenus();
    set({ popularMenus: data });
  },

  // 최근 30일 매출 조회
  loadSalesHistory: async () => {
    const data = await getSalesHistory();
    set({ salesHistory: data });
  },

  loadSalesAnalytics: async (filters) => {
    set({ isSalesAnalyticsLoading: true, salesAnalyticsError: null });

    try {
      const data = await getSalesAnalytics(filters);
      set({ salesAnalytics: data, isSalesAnalyticsLoading: false });
      return data;
    } catch (error) {
      set({
        salesAnalyticsError: "매출 통계를 불러오지 못했습니다.",
        isSalesAnalyticsLoading: false,
      });
      return null;
    }
  },
}));

export default useSalesStore;

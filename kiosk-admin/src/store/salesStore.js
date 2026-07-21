import { create } from "zustand";
import {
  getSalesSummary,
  getPopularMenus,
  getSalesHistory,
} from "../api/salesApi";

const useSalesStore = create((set) => ({
  // 상태
  salesSummary: null,
  popularMenus: [],
  salesHistory: [],

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
}));

export default useSalesStore;
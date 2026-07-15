import { create } from "zustand";
import { getOrders, updateOrderStatus, cancelOrder } from "../api/orderApi";
import useHistoryStore from "./historyStore";

const useOrderStore = create((set, get) => ({
  orders: [],
  // 주문 목록 불러오기 AdminSummary와 AdminOrder가 함께 공유
  loadOrders: async () => {
    try {
      const data = await getOrders();
      set({ orders: data });
    } catch (error) {
      console.error("주문 불러오기 실패:", error);
    }
  },
  // 주문 상태 변경
  changeOrderStatus: async (orderNumber) => {
    try {
      await updateOrderStatus(orderNumber); // API가 내부적으로 다음 상태를 계산함
      await get().loadOrders(); // 변경 후 최신 목록 갱신
    } catch (error) {
      console.error("상태 변경 실패:", error);
    }
  },
  // 주문 취소
  cancelOrder: async (orderNumber) => {
    try {
      await cancelOrder(orderNumber);
      await get().loadOrders(); // 취소 후 최신 목록 갱신
//히스토리용
      useHistoryStore.getState().addHistory(
        "주문 취소", 
        `주문번호 ${orderNumber}번이 취소되었습니다.`
      );

    } catch (error) {
      console.error("주문 취소 실패:", error);
    }
  }
}));

export default useOrderStore;
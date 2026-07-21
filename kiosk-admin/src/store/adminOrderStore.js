import { create } from "zustand";
import { getOrders, updateOrderStatus, cancelOrder } from "../api/adminOrderApi";
import useHistoryStore from "./historyStore";

// 주문 목록 불러오기 AdminSummary와 AdminOrder가 함께 공유
const useAdminOrderStore = create((set, get) => ({
  orders: [],
  todaySales: 0,
  loadOrders: async () => {
  try {
    const data = await getOrders();

    const todayDate = "2025-05-20";

    const todaySales = data
      .filter(order =>
        order.created_at.startsWith(todayDate) &&
        order.order_status !== "취소"
      )
      .reduce((sum, order) => sum + order.total_price, 0);

    set({
      orders: data,
      todaySales,
    });
  } catch (error) {
    console.error("주문 불러오기 실패:", error);
  }
},
  // 주문 상태 변경
  changeOrderStatus: async (orderNumber) => {
  try {
    await updateOrderStatus(orderNumber);
    await get().loadOrders();

    useHistoryStore.getState().addHistory(
      "주문 상태 변경",
      `주문번호 ${orderNumber}번의 조리 상태가 변경되었습니다.`
    );

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

export default useAdminOrderStore;
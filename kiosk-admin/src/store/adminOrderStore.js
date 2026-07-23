import { create } from "zustand";
import {
  getOrders,
  updateOrderStatus,
  cancelOrder,
} from "../api/adminOrderApi";
import useHistoryStore from "./historyStore";

const useAdminOrderStore = create((set, get) => ({
  orders: [],
  todaySales: 0,

  // 주문 목록 조회
  loadOrders: async () => {
    try {
      console.log("loadOrders 실행");

      const data = await getOrders();

      console.log("store 받은 주문:", data);

      const today = new Date().toISOString().slice(0, 10);

      const todaySales = data
        .filter(
          (order) =>
            order.created_at.startsWith(today) &&
            order.order_status !== "취소"
        )
        .reduce(
          (sum, order) => sum + order.total_price,
          0
        );

      set({
        orders: data,
        todaySales,
      });

    } catch (error) {
      console.error("주문 불러오기 실패:", error);
      throw error;
    }
  },


  // 주문 상태 변경
  changeOrderStatus: async (orderId, orderStatus) => {
    try {
      console.log(
        "주문 상태 변경 요청:",
        orderId,
        orderStatus
      );

      await updateOrderStatus(
        orderId,
        orderStatus
      );

      await get().loadOrders();

      useHistoryStore.getState().addHistory(
        "주문 상태 변경",
        `주문(ID: ${orderId})의 상태가 ${orderStatus}(으)로 변경되었습니다.`
      );

    } catch (error) {
      console.error("상태 변경 실패:", error);
      throw error;
    }
  },


  // 주문 취소
  cancelOrder: async (orderId) => {
    try {
      console.log(
        "주문 취소 요청:",
        orderId
      );

      await cancelOrder(orderId);

      await get().loadOrders();

      useHistoryStore.getState().addHistory(
        "주문 취소",
        `주문(ID: ${orderId})이 취소되었습니다.`
      );

    } catch (error) {
      console.error("주문 취소 실패:", error);
      throw error;
    }
  },
}));

export default useAdminOrderStore;
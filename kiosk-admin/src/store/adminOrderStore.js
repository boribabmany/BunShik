import { create } from "zustand";
import {
  getOrders,
  updateOrderStatus,
  updateBulkOrderStatus,
  cancelBulkOrders,
  cancelOrder,
} from "../api/adminOrderApi";
import { getKoreaDateString } from "../utils/date";

const useAdminOrderStore = create((set, get) => ({
  orders: [],
  todaySales: 0,

  // 주문 목록 조회
  loadOrders: async () => {
    try {
      const data = await getOrders();

      const today = getKoreaDateString();

      const todaySales = data
        .filter(
          (order) =>
            order.created_at.startsWith(today) && order.order_status !== "취소",
        )
        .reduce((sum, order) => sum + order.total_price, 0);

      set({
        orders: data,
        todaySales,
      });

      return data;
    } catch (error) {
      console.error("주문 불러오기 실패:", error);
      throw error;
    }
  },

  // 주문 상태 변경
  changeOrderStatus: async (orderId, orderStatus) => {
    try {
      await updateOrderStatus(orderId, orderStatus);

      await get().loadOrders();
    } catch (error) {
      console.error("상태 변경 실패:", error);
      throw error;
    }
  },

  changeBulkOrderStatus: async (orderIds, orderStatus) => {
    try {
      await updateBulkOrderStatus(orderIds, orderStatus);

      await get().loadOrders();
    } catch (error) {
      console.error("다중 상태 변경 실패:", error);
      throw error;
    }
  },

  cancelBulkOrders: async (orderIds) => {
    try {
      await cancelBulkOrders(orderIds);

      await get().loadOrders();
    } catch (error) {
      console.error("다중 주문 취소 실패:", error);
      throw error;
    }
  },

  // 주문 취소
  cancelOrder: async (orderId) => {
    try {
      await cancelOrder(orderId);

      await get().loadOrders();
    } catch (error) {
      console.error("주문 취소 실패:", error);
      throw error;
    }
  },
}));

export default useAdminOrderStore;

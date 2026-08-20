import { create } from "zustand";
import { persist } from "zustand/middleware";

const useOrderStore = create(
  persist(
    (set) => ({
      orderType: null,
      orderNumber: null,
      totalPrice: 0,
      pendingOrderId: null, // 토스 결제창 열기 전 생성된 주문 id (리다이렉트 후에도 유지)
      completedOrderId: null, // 결제 완료된 주문의 실제 order_id (OrderComplete 화면의 출력 요청용)

      setOrderType: (type) => set({ orderType: type }),
      setOrderNumber: (number) => set({ orderNumber: number }),
      setTotalPrice: (price) => set({ totalPrice: price }),
      setPendingOrderId: (id) => set({ pendingOrderId: id }),
      setCompletedOrderId: (id) => set({ completedOrderId: id }),
      resetOrder: () =>
        set({
          orderType: null,
          orderNumber: null,
          totalPrice: 0,
          pendingOrderId: null,
          completedOrderId: null,
        }),
    }),
    { name: "bunshik-order" },
  ),
);

export default useOrderStore;

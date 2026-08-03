import { create } from "zustand";
import { persist } from "zustand/middleware";

const useOrderStore = create(
  persist(
    (set) => ({
      orderType: null,
      orderNumber: null,
      totalPrice: 0,
      pendingOrderId: null, // 토스 결제창 열기 전 생성된 주문 id (리다이렉트 후에도 유지)

      setOrderType: (type) => set({ orderType: type }),
      setOrderNumber: (number) => set({ orderNumber: number }),
      setTotalPrice: (price) => set({ totalPrice: price }),
      setPendingOrderId: (id) => set({ pendingOrderId: id }),
      resetOrder: () =>
        set({
          orderType: null,
          orderNumber: null,
          totalPrice: 0,
          pendingOrderId: null,
        }),
    }),
    { name: "bunshik-order" },
  ),
);

export default useOrderStore;

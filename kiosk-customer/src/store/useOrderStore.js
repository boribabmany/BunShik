import { create } from "zustand";

const useOrderStore = create((set) => ({
  orderType: null, // 'dine-in' | 'takeout'
  orderNumber: null,
  totalPrice: 0,

  setOrderType: (type) => set({ orderType: type }),
  setOrderNumber: (number) => set({ orderNumber: number }),
  setTotalPrice: (price) => set({ totalPrice: price }),
  resetOrder: () => set({ orderType: null, orderNumber: null, totalPrice: 0 }),
}));

export default useOrderStore;

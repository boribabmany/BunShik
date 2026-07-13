import { create } from "zustand";

const useOrderStore = create((set) => ({
  orderType: null, // 'dine-in' | 'takeout'
  orderNumber: null,

  setOrderType: (type) => set({ orderType: type }),
  setOrderNumber: (number) => set({ orderNumber: number }),
  resetOrder: () => set({ orderType: null, orderNumber: null }),
}));

export default useOrderStore;

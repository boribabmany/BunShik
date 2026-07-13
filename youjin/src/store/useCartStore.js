import { create } from "zustand";

const useCartStore = create((set) => ({
  items: [], // [{ menu_id, menu_name, base_price, quantity, options: [{option_id, option_name, option_price}] }]

  addItem: (item) => set((state) => ({ items: [...state.items, item] })),

  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
    })),

  updateQuantity: (index, quantity) =>
    set((state) => ({
      items: state.items.map((item, i) =>
        i === index ? { ...item, quantity } : item,
      ),
    })),

  clearCart: () => set({ items: [] }),
}));

export default useCartStore;

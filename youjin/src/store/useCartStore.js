import { create } from "zustand";

// 같은 메뉴 + 같은 옵션 조합인지 확인하는 함수
const isSameItem = (a, b) => {
  if (a.menu_id !== b.menu_id) return false;
  if (a.options.length !== b.options.length) return false;

  const aIds = a.options.map((o) => o.option_id).sort();
  const bIds = b.options.map((o) => o.option_id).sort();
  return aIds.every((id, i) => id === bIds[i]);
};

const useCartStore = create((set) => ({
  items: [], // [{ menu_id, menu_name, image_url, base_price, quantity, options: [{option_id, option_name, option_price}] }]

  addItem: (newItem) =>
    set((state) => {
      const existingIndex = state.items.findIndex((item) =>
        isSameItem(item, newItem),
      );

      if (existingIndex !== -1) {
        // 같은 메뉴+옵션이 이미 있으면 수량만 증가
        const updatedItems = state.items.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item,
        );
        return { items: updatedItems };
      }

      // 없으면 새로 추가
      return { items: [...state.items, newItem] };
    }),

  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
    })),

  increaseQuantity: (index) =>
    set((state) => ({
      items: state.items.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),

  decreaseQuantity: (index) =>
    set((state) => ({
      items: state.items.map((item, i) =>
        i === index && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    })),

  clearCart: () => set({ items: [] }),
}));

export default useCartStore;

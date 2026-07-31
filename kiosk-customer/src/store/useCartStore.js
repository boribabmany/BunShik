import { create } from "zustand";

// 같은 메뉴 + 같은 옵션 + 같은 세트구성 조합인지 확인하는 함수
const isSameItem = (a, b) => {
  if (a.menu_id !== b.menu_id) return false;

  if (a.options.length !== b.options.length) return false;
  const aOptionIds = a.options.map((o) => o.option_id).sort();
  const bOptionIds = b.options.map((o) => o.option_id).sort();
  if (!aOptionIds.every((id, i) => id === bOptionIds[i])) return false;

  const aComponents = a.components || [];
  const bComponents = b.components || [];
  if (aComponents.length !== bComponents.length) return false;
  const aComponentIds = aComponents.map((c) => c.component_menu_id).sort();
  const bComponentIds = bComponents.map((c) => c.component_menu_id).sort();
  return aComponentIds.every((id, i) => id === bComponentIds[i]);
};

// 항목 하나의 합계 (기본가 + 옵션가 + 세트구성 추가금 합) * 수량
const getItemTotal = (item) => {
  const optionTotal = item.options.reduce((sum, o) => sum + o.option_price, 0);
  const componentTotal = (item.components || []).reduce(
    (sum, c) => sum + c.extra_price,
    0,
  );
  return (item.base_price + optionTotal + componentTotal) * item.quantity;
};

const useCartStore = create((set, get) => ({
  items: [], // [{ menu_id, menu_name, image_url, base_price, quantity, options: [...], components: [...] }]

  addItem: (newItem) =>
    set((state) => {
      const existingIndex = state.items.findIndex((item) =>
        isSameItem(item, newItem),
      );

      if (existingIndex !== -1) {
        const updatedItems = state.items.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item,
        );
        return { items: updatedItems };
      }

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

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + getItemTotal(item), 0);
  },
}));

export default useCartStore;

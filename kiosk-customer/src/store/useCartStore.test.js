import useCartStore from "./useCartStore";

const baseItem = (overrides = {}) => ({
  menu_id: 1,
  menu_name: "떡볶이",
  menu_name_en: "Tteokbokki",
  image_url: "/tteokbokki.png",
  base_price: 4000,
  quantity: 1,
  options: [],
  components: [],
  ...overrides,
});

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    window.localStorage.clear();
  });

  test("addItem: 장바구니가 비어있으면 새 항목을 추가한다", () => {
    useCartStore.getState().addItem(baseItem());

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].menu_id).toBe(1);
  });

  test("addItem: 옵션/세트구성까지 동일한 메뉴를 추가하면 수량만 합쳐진다", () => {
    useCartStore.getState().addItem(baseItem({ quantity: 1 }));
    useCartStore.getState().addItem(baseItem({ quantity: 2 }));

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  test("addItem: 옵션이 다르면 별개 항목으로 추가된다", () => {
    useCartStore.getState().addItem(baseItem());
    useCartStore.getState().addItem(
      baseItem({
        options: [{ option_id: 10, option_name: "치즈추가", option_price: 500 }],
      }),
    );

    expect(useCartStore.getState().items).toHaveLength(2);
  });

  test("addItem: 세트구성(components)이 다르면 별개 항목으로 추가된다", () => {
    useCartStore.getState().addItem(baseItem());
    useCartStore.getState().addItem(
      baseItem({
        components: [{ component_menu_id: 99, extra_price: 0 }],
      }),
    );

    expect(useCartStore.getState().items).toHaveLength(2);
  });

  test("removeItem: 지정한 인덱스의 항목을 제거한다", () => {
    useCartStore.getState().addItem(baseItem({ menu_id: 1 }));
    useCartStore.getState().addItem(baseItem({ menu_id: 2 }));

    useCartStore.getState().removeItem(0);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].menu_id).toBe(2);
  });

  test("increaseQuantity: 수량이 1 증가한다", () => {
    useCartStore.getState().addItem(baseItem({ quantity: 1 }));
    useCartStore.getState().increaseQuantity(0);

    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  test("decreaseQuantity: 수량이 1 감소한다", () => {
    useCartStore.getState().addItem(baseItem({ quantity: 2 }));
    useCartStore.getState().decreaseQuantity(0);

    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  test("decreaseQuantity: 수량이 1일 때는 더 줄어들지 않는다", () => {
    useCartStore.getState().addItem(baseItem({ quantity: 1 }));
    useCartStore.getState().decreaseQuantity(0);

    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  test("clearCart: 모든 항목을 비운다", () => {
    useCartStore.getState().addItem(baseItem());
    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toEqual([]);
  });

  test("getTotalPrice: 옵션/세트구성/수량을 반영해 총액을 계산한다", () => {
    useCartStore.getState().addItem(
      baseItem({
        base_price: 4000,
        quantity: 2,
        options: [{ option_id: 1, option_price: 500 }],
        components: [{ component_menu_id: 1, extra_price: 1000 }],
      }),
    );

    // (4000 + 500 + 1000) * 2 = 11000
    expect(useCartStore.getState().getTotalPrice()).toBe(11000);
  });

  test("getTotalPrice: 항목이 여러 개면 합산한다", () => {
    useCartStore.getState().addItem(baseItem({ menu_id: 1, base_price: 3000, quantity: 1 }));
    useCartStore
      .getState()
      .addItem(baseItem({ menu_id: 2, base_price: 2000, quantity: 3 }));

    expect(useCartStore.getState().getTotalPrice()).toBe(3000 + 2000 * 3);
  });
});

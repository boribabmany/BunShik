import useOrderStore from "./useOrderStore";

describe("useOrderStore", () => {
  beforeEach(() => {
    useOrderStore.setState({
      orderType: null,
      orderNumber: null,
      totalPrice: 0,
      pendingOrderId: null,
    });
    window.localStorage.clear();
  });

  test("setOrderType: 주문 타입을 설정한다", () => {
    useOrderStore.getState().setOrderType("dine-in");
    expect(useOrderStore.getState().orderType).toBe("dine-in");
  });

  test("setOrderNumber: 주문 번호를 설정한다", () => {
    useOrderStore.getState().setOrderNumber("A-12");
    expect(useOrderStore.getState().orderNumber).toBe("A-12");
  });

  test("setTotalPrice: 총 결제 금액을 설정한다", () => {
    useOrderStore.getState().setTotalPrice(12000);
    expect(useOrderStore.getState().totalPrice).toBe(12000);
  });

  test("setPendingOrderId: 결제 대기 중인 주문 id를 설정한다", () => {
    useOrderStore.getState().setPendingOrderId(42);
    expect(useOrderStore.getState().pendingOrderId).toBe(42);
  });

  test("resetOrder: 모든 값을 초기 상태로 되돌린다", () => {
    useOrderStore.getState().setOrderType("takeout");
    useOrderStore.getState().setOrderNumber("A-1");
    useOrderStore.getState().setTotalPrice(5000);
    useOrderStore.getState().setPendingOrderId(1);

    useOrderStore.getState().resetOrder();

    expect(useOrderStore.getState()).toMatchObject({
      orderType: null,
      orderNumber: null,
      totalPrice: 0,
      pendingOrderId: null,
    });
  });
});

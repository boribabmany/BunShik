import {
  getOrders,
  updateOrderStatus,
  cancelOrder,
} from "../api/orderApi";

describe("orderApi", () => {
  test("주문 조회", async () => {
    const orders = await getOrders();

    expect(orders).toBeDefined();
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);
  });

  test("주문 상태 변경", async () => {
    await updateOrderStatus("A-003");

    const orders = await getOrders();
    const order = orders.find(
      (order) => order.order_number === "A-003"
    );

    expect(order.order_status).toBe("조리중");
  });

  test("주문 취소", async () => {
    await cancelOrder("A-004");

    const orders = await getOrders();
    const order = orders.find(
      (order) => order.order_number === "A-004"
    );

    expect(order.order_status).toBe("취소");
  });
});
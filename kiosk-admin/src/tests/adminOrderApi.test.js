import api from "../api/axios";
import { getOrderDetail, getOrders } from "../api/adminOrderApi";

jest.mock("../api/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("adminOrderApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("주문 목록에 결제방법을 포함한다", async () => {
    api.get.mockResolvedValue({
      data: {
        data: [
          {
            orderId: 1,
            orderNumber: "A-001",
            orderType: "매장",
            paymentMethod: "카드",
            orderStatus: "접수",
            totalPrice: 5000,
            createdAt: "2026-08-03T10:00:00",
          },
        ],
      },
    });

    const orders = await getOrders();

    expect(orders[0].payment_method).toBe("카드");
  });

  test("주문 상세에 결제방법을 포함한다", async () => {
    api.get.mockResolvedValue({
      data: {
        data: {
          orderId: 1,
          orderNumber: "A-001",
          orderType: "포장",
          paymentMethod: "카카오페이",
          orderStatus: "완료",
          totalPrice: 7000,
          createdAt: "2026-08-03T10:00:00",
          items: [],
        },
      },
    });

    const detail = await getOrderDetail(1);

    expect(detail.payment_method).toBe("카카오페이");
  });
});

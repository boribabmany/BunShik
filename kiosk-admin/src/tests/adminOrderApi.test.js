/**
 * 적용 화면: 관리자 주문 관리 페이지 (/adminorder)
 * 테스트 내용: 주문 목록·상세 API 응답에 결제수단 정보가 포함되는지 검증한다.
 */
import api from "../api/axios";
import {
  getOrderDetail,
  getOrders,
  updateBulkOrderStatus,
  cancelBulkOrders,
} from "../api/adminOrderApi";

jest.mock("../api/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
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

  test("선택한 주문의 상태를 한 번에 변경한다", async () => {
    api.patch.mockResolvedValue({ data: { data: 2 } });

    await expect(
      updateBulkOrderStatus([1, 2], "조리중"),
    ).resolves.toBe(2);
    expect(api.patch).toHaveBeenCalledWith(
      "/api/admin/orders/bulk/status",
      { orderIds: [1, 2], orderStatus: "조리중" },
    );
  });

  test("선택한 주문을 한 번에 취소한다", async () => {
    api.patch.mockResolvedValue({ data: { data: 2 } });

    await expect(cancelBulkOrders([1, 2])).resolves.toBe(2);
    expect(api.patch).toHaveBeenCalledWith(
      "/api/admin/orders/bulk/cancel",
      { orderIds: [1, 2] },
    );
  });
});

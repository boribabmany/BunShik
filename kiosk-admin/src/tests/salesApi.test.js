import api from "../api/axios";
import { getSalesAnalytics } from "../api/salesApi";

jest.mock("../api/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("salesApi", () => {
  test("선택한 기간과 기준 날짜로 매출 분석을 조회한다", async () => {
    const analytics = { period: "week", paymentStats: [] };
    api.get.mockResolvedValue({ data: { data: analytics } });

    await expect(
      getSalesAnalytics({ period: "week", date: "2026-08-03" }),
    ).resolves.toEqual(analytics);
    expect(api.get).toHaveBeenCalledWith("/api/admin/sales/analytics", {
      params: { period: "week", date: "2026-08-03" },
    });
  });
});

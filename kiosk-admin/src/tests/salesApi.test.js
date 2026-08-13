/**
 * 적용 화면: 관리자 매출 대시보드 (/adminsales)
 * 테스트 내용: 선택한 기간과 기준 날짜가 매출 분석 API에 전달되는지 검증한다.
 */
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

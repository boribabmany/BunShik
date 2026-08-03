import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminSalesDashboard from "../pages/admin/AdminSalesDashboard";
import useSalesStore from "../store/salesStore";
import { getKoreaDateString } from "../utils/date";
import {
  downloadSalesCsv,
  downloadSalesExcel,
} from "../utils/salesExport";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock("../store/salesStore");
jest.mock("../utils/salesExport", () => ({
  downloadSalesCsv: jest.fn(),
  downloadSalesExcel: jest.fn(),
}));
jest.mock("recharts", () => ({
  Area: () => null,
  Bar: () => null,
  BarChart: ({ children }) => <svg>{children}</svg>,
  CartesianGrid: () => null,
  ComposedChart: ({ children }) => <svg>{children}</svg>,
  Line: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

const analytics = {
  period: "day",
  startDate: "2026-08-03",
  endDate: "2026-08-03",
  summary: {
    totalSales: 100000,
    orderCount: 10,
    averageOrderPrice: 10000,
  },
  history: [
    { salesDate: "2026-08-03", orderCount: 10, totalSales: 100000 },
  ],
  menuStats: [
    { menuId: 1, menuName: "떡볶이", quantity: 12, totalSales: 60000 },
  ],
  paymentStats: [
    { paymentMethod: "카드", orderCount: 7, totalSales: 70000 },
    { paymentMethod: "카카오페이", orderCount: 3, totalSales: 30000 },
  ],
};

describe("관리자 매출 분석", () => {
  const loadSalesAnalytics = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useSalesStore.mockReturnValue({
      salesAnalytics: analytics,
      isSalesAnalyticsLoading: false,
      salesAnalyticsError: null,
      loadSalesAnalytics,
    });
  });

  test("일·주·월 기간과 결제수단별 통계를 표시한다", async () => {
    render(<AdminSalesDashboard />);

    await waitFor(() => {
      expect(loadSalesAnalytics).toHaveBeenCalledWith({
        period: "day",
        date: getKoreaDateString(),
      });
    });

    expect(screen.getByText("결제수단별 통계")).toBeTruthy();
    expect(screen.getByText("카드")).toBeTruthy();
    expect(screen.getByText("카카오페이")).toBeTruthy();
    expect(screen.getByText("₩70,000")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "주" }));

    await waitFor(() => {
      expect(loadSalesAnalytics).toHaveBeenLastCalledWith({
        period: "week",
        date: getKoreaDateString(),
      });
    });
  });

  test("현재 조회 결과를 CSV와 Excel로 전달한다", () => {
    render(<AdminSalesDashboard />);

    const csvButton = screen.getByRole("button", { name: "CSV 다운로드" });
    const filterPanel = csvButton.closest(".sales-filter-panel");
    expect(filterPanel.nextElementSibling.classList.contains("sales-trend-chart"))
      .toBe(true);

    fireEvent.click(csvButton);
    fireEvent.click(screen.getByRole("button", { name: "Excel 다운로드" }));

    expect(downloadSalesCsv).toHaveBeenCalledWith(
      analytics,
      expect.objectContaining({ periodLabel: "일" }),
    );
    expect(downloadSalesExcel).toHaveBeenCalledWith(
      analytics,
      expect.objectContaining({ periodLabel: "일" }),
    );
  });
});

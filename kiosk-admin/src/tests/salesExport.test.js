import { buildSalesCsv, buildSalesExcel } from "../utils/salesExport";

const analytics = {
  summary: { totalSales: 10000, orderCount: 2, averageOrderPrice: 5000 },
  history: [
    { salesDate: "2026-08-03", orderCount: 2, totalSales: 10000 },
  ],
  menuStats: [
    { menuName: "떡볶이 & 튀김", quantity: 2, totalSales: 10000 },
  ],
  paymentStats: [
    { paymentMethod: "카드", orderCount: 2, totalSales: 10000 },
  ],
};
const meta = { periodLabel: "일", periodRange: "2026-08-03" };

describe("매출 파일 생성", () => {
  test("한글 Excel 호환 BOM을 포함한 CSV를 만든다", () => {
    const csv = buildSalesCsv(analytics, meta);

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain('"메뉴별 통계"');
    expect(csv).toContain('"결제수단별 통계"');
    expect(csv).toContain('"카드","2","10000"');
  });

  test("통계별 시트가 포함된 Excel XML 파일을 만든다", () => {
    const excel = buildSalesExcel(analytics, meta);

    expect(excel).toContain('ss:Name="매출 요약"');
    expect(excel).toContain('ss:Name="메뉴별 통계"');
    expect(excel).toContain('ss:Name="결제수단별 통계"');
    expect(excel).toContain("떡볶이 &amp; 튀김");
  });
});

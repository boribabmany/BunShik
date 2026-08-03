const protectSpreadsheetText = (value) => {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
};

const escapeCsv = (value) => {
  const text = protectSpreadsheetText(value);
  return `"${text.replace(/"/g, '""')}"`;
};

const escapeXml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const getRows = (analytics, meta) => {
  const summary = analytics?.summary ?? {};
  const history = analytics?.history ?? [];
  const menuStats = analytics?.menuStats ?? [];
  const paymentStats = analytics?.paymentStats ?? [];

  return {
    overview: [
      ["조회 단위", meta.periodLabel],
      ["조회 기간", meta.periodRange],
      ["총매출", Number(summary.totalSales ?? 0)],
      ["완료 주문 건수", Number(summary.orderCount ?? 0)],
      ["평균 주문금액", Math.round(Number(summary.averageOrderPrice ?? 0))],
    ],
    history: [
      ["날짜", "주문수", "매출"],
      ...history.map((item) => [
        item.salesDate,
        Number(item.orderCount ?? 0),
        Number(item.totalSales ?? 0),
      ]),
    ],
    menus: [
      ["메뉴명", "판매수량", "매출"],
      ...menuStats.map((item) => [
        item.menuName,
        Number(item.quantity ?? 0),
        Number(item.totalSales ?? 0),
      ]),
    ],
    payments: [
      ["결제수단", "주문수", "매출"],
      ...paymentStats.map((item) => [
        item.paymentMethod,
        Number(item.orderCount ?? 0),
        Number(item.totalSales ?? 0),
      ]),
    ],
  };
};

export const buildSalesCsv = (analytics, meta) => {
  const rows = getRows(analytics, meta);
  const csvRows = [
    ["매출 요약"],
    ...rows.overview,
    [],
    ["일별 매출"],
    ...rows.history,
    [],
    ["메뉴별 통계"],
    ...rows.menus,
    [],
    ["결제수단별 통계"],
    ...rows.payments,
  ];

  return `\uFEFF${csvRows
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n")}`;
};

const excelCell = (value) => {
  const isNumber = typeof value === "number" && Number.isFinite(value);
  return `<Cell><Data ss:Type="${isNumber ? "Number" : "String"}">${escapeXml(
    value,
  )}</Data></Cell>`;
};

const excelWorksheet = (name, rows) => `
  <Worksheet ss:Name="${escapeXml(name)}">
    <Table>
      ${rows
        .map((row) => `<Row>${row.map(excelCell).join("")}</Row>`)
        .join("")}
    </Table>
  </Worksheet>`;

export const buildSalesExcel = (analytics, meta) => {
  const rows = getRows(analytics, meta);

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  ${excelWorksheet("매출 요약", rows.overview)}
  ${excelWorksheet("일별 매출", rows.history)}
  ${excelWorksheet("메뉴별 통계", rows.menus)}
  ${excelWorksheet("결제수단별 통계", rows.payments)}
</Workbook>`;
};

const downloadBlob = (content, type, filename) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const buildFilename = (analytics, extension) => {
  const start = analytics?.startDate ?? "sales";
  const end = analytics?.endDate ?? start;
  const range = start === end ? start : `${start}_${end}`;
  return `매출통계_${range}.${extension}`;
};

export const downloadSalesCsv = (analytics, meta) => {
  downloadBlob(
    buildSalesCsv(analytics, meta),
    "text/csv;charset=utf-8",
    buildFilename(analytics, "csv"),
  );
};

export const downloadSalesExcel = (analytics, meta) => {
  downloadBlob(
    buildSalesExcel(analytics, meta),
    "application/vnd.ms-excel;charset=utf-8",
    buildFilename(analytics, "xls"),
  );
};

export default function SalesSummary({ summary, periodRange }) {
  if (!summary) {
    return <div className="sales-loading">매출 데이터를 불러오는 중...</div>;
  }
  return (
    <div className="sales-summary">
      <div className="today-sales-card">
        <h2>선택 기간 총매출</h2>

        <div className="today-sales-amount">
          ₩{(summary.totalSales ?? 0).toLocaleString()}
        </div>

        <p>{periodRange}</p>
      </div>

      <div className="summary-grid">
        <div className="sale-summary-card">
          <h3>완료 주문 건수</h3>
          <strong>{summary.orderCount ?? 0}건</strong>
        </div>

        <div className="sale-summary-card">
          <h3>평균 주문금액</h3>
          <strong>
            ₩{Math.round(summary.averageOrderPrice ?? 0).toLocaleString()}
          </strong>
        </div>
      </div>
    </div>
  );
}

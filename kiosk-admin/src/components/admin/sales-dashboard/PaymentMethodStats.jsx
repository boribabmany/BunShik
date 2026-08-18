export default function PaymentMethodStats({ paymentStats = [], periodRange }) {
  const totalSales = paymentStats.reduce(
    (sum, payment) => sum + Number(payment.totalSales ?? 0),
    0,
  );

  return (
    <div className="payment-method-stats">
      <div className="chart-card-header">
        <div>
          <h2>결제수단별 통계</h2>
          <p>{periodRange} · 완료 주문 기준</p>
        </div>
      </div>

      {paymentStats.length > 0 ? (
        <div className="payment-stat-list">
          {paymentStats.map((payment) => {
            const sales = Number(payment.totalSales ?? 0);
            const share = totalSales > 0 ? (sales / totalSales) * 100 : 0;

            return (
              <div className="payment-stat-item" key={payment.paymentMethod}>
                <div className="payment-stat-heading">
                  <strong>{payment.paymentMethod}</strong>
                  <span>{payment.orderCount ?? 0}건</span>
                  <span>₩{sales.toLocaleString()}</span>
                </div>
                <div className="payment-share-track" aria-hidden="true">
                  <span style={{ width: `${share}%` }} />
                </div>
                <small>{share.toFixed(1)}%</small>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="sales-chart-empty">결제수단 데이터가 없습니다.</div>
      )}
    </div>
  );
}

import { useEffect } from "react";
import useSalesStore from "../../store/salesStore";

export default function SalesSummary() {
  const { salesSummary, loadSalesSummary } = useSalesStore();

  useEffect(() => {
    loadSalesSummary();
  }, [loadSalesSummary]);

  return (
    <div className="sales-summary">

      <div className="today-sales-card">
        <h2>오늘의 매출</h2>

        <div className="today-sales-amount">
          ₩{salesSummary?.today_sales.toLocaleString()}
        </div>

        <p>오늘 주문 : {salesSummary?.today_order_count}건</p>
      </div>

      <div className="summary-grid">

        <div className="sale-summary-card">
          <h3>이번 달 매출</h3>
          <strong>
            ₩{salesSummary?.month_sales.toLocaleString()}
          </strong>
        </div>

        <div className="sale-summary-card">
          <h3>어제 매출</h3>
          <strong>
            ₩{salesSummary?.yesterday_sales.toLocaleString()}
          </strong>
        </div>

        <div className="sale-summary-card">
          <h3>평균 주문금액</h3>
          <strong>
            ₩{salesSummary?.average_order_price.toLocaleString()}
          </strong>
        </div>

        <div className="sale-summary-card">
          <h3>이번달 완료 주문 건수</h3>
          <strong>
            {salesSummary?.month_completed_order_count}건
          </strong>
        </div>

      </div>

    </div>
  );
}
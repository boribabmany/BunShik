import { useEffect } from "react";
import useSalesStore from "../../store/salesStore";

export default function SalesSummary() {
  const { salesSummary, loadSalesSummary } = useSalesStore();

  useEffect(() => {
    loadSalesSummary();
  }, [loadSalesSummary]);

  if (!salesSummary) {
    return <div>매출 데이터 불러오는 중...</div>;
  }

  return (
    <div className="sales-summary">

      <div className="today-sales-card">
        <h2>오늘의 매출</h2>

        <div className="today-sales-amount">
          ₩{(salesSummary.todaySales ?? 0).toLocaleString()}
        </div>

        <p>
          오늘 주문 : {salesSummary.todayOrders ?? 0}건
        </p>
      </div>


      <div className="summary-grid">

        <div className="sale-summary-card">
          <h3>이번 달 매출</h3>
          <strong>
            ₩{(salesSummary.monthlySales ?? 0).toLocaleString()}
          </strong>
        </div>


        <div className="sale-summary-card">
          <h3>어제 매출</h3>
          <strong>
            ₩{(salesSummary.yesterdaySales ?? 0).toLocaleString()}
          </strong>
        </div>


        <div className="sale-summary-card">
          <h3>평균 주문금액</h3>
          <strong>
            ₩{(salesSummary.averageOrderPrice ?? 0).toLocaleString()}
          </strong>
        </div>


        <div className="sale-summary-card">
          <h3>완료 주문 건수</h3>
          <strong>
            {salesSummary.completedOrders ?? 0}건
          </strong>
        </div>

      </div>

    </div>
  );
}
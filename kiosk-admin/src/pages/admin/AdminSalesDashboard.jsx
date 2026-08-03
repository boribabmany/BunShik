import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/AdminSalesDashboard.css";

import SalesSummary from "../../components/admin/SalesSummary";
import SalesTrendChart from "../../components/admin/SalesTrendChart";
import PopularMenu from "../../components/admin/PopularMenu";
import SalesHistoryTable from "../../components/admin/SalesHistoryTable";
import PaymentMethodStats from "../../components/admin/PaymentMethodStats";
import useSalesStore from "../../store/salesStore";
import { getKoreaDateString } from "../../utils/date";
import {
  downloadSalesCsv,
  downloadSalesExcel,
} from "../../utils/salesExport";

const PERIOD_LABELS = {
  day: "일",
  week: "주",
  month: "월",
};

export default function AdminSalesDashboard() {
  const navigate = useNavigate();
  const {
    salesAnalytics,
    isSalesAnalyticsLoading,
    salesAnalyticsError,
    loadSalesAnalytics,
  } = useSalesStore();
  const [period, setPeriod] = useState("day");
  const [date, setDate] = useState(getKoreaDateString());

  useEffect(() => {
    if (!date) return;
    loadSalesAnalytics({ period, date });
  }, [date, loadSalesAnalytics, period]);

  const periodRange = salesAnalytics
    ? salesAnalytics.startDate === salesAnalytics.endDate
      ? salesAnalytics.startDate
      : `${salesAnalytics.startDate} ~ ${salesAnalytics.endDate}`
    : date;

  const exportMeta = {
    periodLabel: PERIOD_LABELS[period],
    periodRange,
  };

  return (
    <div className="admin-sales-page">
      <header className="sales-header">
        <div>
          <h1>매출 대시보드</h1>
          <p>매출 흐름과 메뉴·결제수단 통계를 한눈에 확인하세요.</p>
        </div>

        <button
          className="sales-back-btn"
          onClick={() => navigate("/adminmenu")}
        >
          ← 관리자 메뉴
        </button>
      </header>

      <main className="sales-layout">
        {salesAnalyticsError && (
          <div className="sales-error" role="alert">
            {salesAnalyticsError}
          </div>
        )}

        {isSalesAnalyticsLoading && !salesAnalytics ? (
          <div className="sales-loading">매출 데이터를 불러오는 중...</div>
        ) : (
          <>
            <SalesSummary
              summary={salesAnalytics?.summary}
              periodRange={periodRange}
            />

            <section className="sales-filter-panel" aria-label="매출 조회 조건">
              <div className="period-selector" aria-label="조회 기간 단위">
                {Object.entries(PERIOD_LABELS).map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className={period === value ? "active" : ""}
                    aria-pressed={period === value}
                    onClick={() => setPeriod(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <label className="sales-date-field">
                기준 날짜
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>

              <div className="sales-export-actions">
                <button
                  type="button"
                  disabled={!salesAnalytics || isSalesAnalyticsLoading}
                  onClick={() => downloadSalesCsv(salesAnalytics, exportMeta)}
                >
                  CSV 다운로드
                </button>
                <button
                  type="button"
                  disabled={!salesAnalytics || isSalesAnalyticsLoading}
                  onClick={() => downloadSalesExcel(salesAnalytics, exportMeta)}
                >
                  Excel 다운로드
                </button>
              </div>
            </section>

            <SalesTrendChart
              salesHistory={salesAnalytics?.history}
              periodRange={periodRange}
            />

            <section className="sales-breakdown-grid">
              <PopularMenu
                popularMenus={salesAnalytics?.menuStats}
                periodRange={periodRange}
              />
              <PaymentMethodStats
                paymentStats={salesAnalytics?.paymentStats}
                periodRange={periodRange}
              />
            </section>

            <SalesHistoryTable
              salesHistory={salesAnalytics?.history}
              periodRange={periodRange}
            />
          </>
        )}
      </main>
    </div>
  );
}

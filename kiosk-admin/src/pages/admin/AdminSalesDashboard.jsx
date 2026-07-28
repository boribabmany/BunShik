import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/AdminSalesDashboard.css";

import SalesSummary from "../../components/admin/SalesSummary";
import SalesTrendChart from "../../components/admin/SalesTrendChart";
import PopularMenu from "../../components/admin/PopularMenu";
import SalesHistoryTable from "../../components/admin/SalesHistoryTable";
import useSalesStore from "../../store/salesStore";

export default function AdminSalesDashboard() {
  const navigate = useNavigate();
  const { loadSalesSummary, loadPopularMenus, loadSalesHistory } =
    useSalesStore();

  useEffect(() => {
    loadSalesSummary();
    loadPopularMenus();
    loadSalesHistory();
  }, [loadPopularMenus, loadSalesHistory, loadSalesSummary]);

  return (
    <div className="admin-sales-page">
      <header className="sales-header">
        <div>
          <h1>매출 대시보드</h1>
          <p>매출 흐름과 인기 메뉴를 한눈에 확인하세요.</p>
        </div>

        <button
          className="sales-back-btn"
          onClick={() => navigate("/adminmenu")}
        >
          ← 관리자 메뉴
        </button>
      </header>

      <main className="sales-layout">
        <SalesSummary />

        <section className="sales-chart-grid">
          <SalesTrendChart />
          <PopularMenu />
        </section>

        <SalesHistoryTable />
      </main>
    </div>
  );
}

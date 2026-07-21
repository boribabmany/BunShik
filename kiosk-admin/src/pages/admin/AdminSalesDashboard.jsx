import { useNavigate } from "react-router-dom";

import "../../styles/AdminSalesDashboard.css";

import SalesSummary from "../../components/admin/SalesSummary";
import PopularMenu from "../../components/admin/PopularMenu";
import SalesHistoryTable from "../../components/admin/SalesHistoryTable";

export default function AdminSalesDashboard() {
  const navigate = useNavigate();
  return (
    <div className="admin-sales-page">
      <header className="sales-header">
        <h1> 매출 대시보드</h1>

        <button className="back-btn" onClick={() => navigate("/adminmenu")}>
          ← 관리자 메뉴
        </button>
      </header>

      <main className="sales-layout">
        <SalesSummary />

        <PopularMenu />

        <SalesHistoryTable />
      </main>
    </div>
  );
}
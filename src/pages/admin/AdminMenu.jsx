import { useNavigate } from "react-router-dom";
import AdminSummary from "../../components/admin/AdminSummary";
import AdminMenusTable from "../../components/admin/AdminMenusTable";
import AdminOptionsTable from "../../components/admin/AdminOptionsTable";
import "../../styles/AdminMenu.css";

export default function AdminMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/adminlogin");
  };

  return (
    <div className="admin-menu-page">

      <header className="admin-header">
        <h1>관리자 메뉴 관리(디자인및 이것저것 미완성)</h1>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </header>

      <main className="admin-layout">

        <section className="left-panel">
          <AdminSummary
            onMoveOrder={() => navigate("/adminorder")}
          />
        </section>

        <section className="right-panel">
          <AdminMenusTable />
          <AdminOptionsTable />
        </section>

      </main>

    </div>
  );
}
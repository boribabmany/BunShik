import { useNavigate } from "react-router-dom";
import AdminSummary from "../../components/admin/AdminSummary";
import AdminMenusTable from "../../components/admin/AdminMenusTable";
import AdminOptionsTable from "../../components/admin/AdminOptionsTable";
import "../../styles/AdminMenu.css";
import bunshikLogo from "../../images/bunshiklogo.png";

export default function AdminMenu() {
  const navigate = useNavigate();
  //로그아웃
  const handleLogout = () => {
  sessionStorage.removeItem("isAdminLoggedIn");
  navigate("/adminlogin");
};

  return (
    <div className="admin-menu-page">
      <header className="admin-header">
  <div className="admin-title">
    <img
      src={bunshikLogo}
      alt="분식 로고"
      className="admin-logo"
    />

    <h1>관리자 메뉴 관리</h1>
  </div>

  <button className="logout-btn" onClick={handleLogout}>
    로그아웃
  </button>
</header>

      <main className="admin-layout">
        <section className="left-panel">
          <AdminSummary onMoveOrder={() => navigate("/adminorder")}/>
        </section>

        <section className="right-panel">
          <AdminMenusTable />
          <AdminOptionsTable />
        </section>

      </main>
    </div>
  );
}
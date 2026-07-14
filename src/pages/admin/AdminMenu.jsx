import { useNavigate } from "react-router-dom";
import AdminSummary from "../../components/admin/AdminSummary";
import AdminMenusTable from "../../components/admin/AdminMenusTable";
import AdminOptionsTable from "../../components/admin/AdminOptionsTable";

export default function AdminMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/adminlogin");
  };

  return (
    <div>
      <header>
        <h1>관리자 메뉴 관리</h1>

        <button onClick={handleLogout}>
          로그아웃
        </button>
      </header>

      <main>
        {/* 왼쪽 영역 */}
        <section>
          <AdminSummary 
            onMoveOrder={() => navigate("/adminorder")}
          />
        </section>
        {/* 오른쪽 영역 */}
        <section>
          <AdminMenusTable />
          <AdminOptionsTable />
        </section>
      </main>
    </div>
  );
}
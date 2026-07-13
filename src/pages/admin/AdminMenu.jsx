import { useNavigate } from "react-router-dom";
import AdminSummary from "../../components/admin/AdminSummary";
import AdminMenusTable from "../../components/admin/AdminMenusTable";
import AdminOptionsTable from "../../components/admin/AdminOptionsTable";

export default function AdminMenu() {
  const navigate = useNavigate();

  return (
    <div>

      <header>
        <h1>메뉴 관리</h1>
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

          {/* 메뉴 리스트 */}
          <AdminMenusTable />

          {/* 옵션 리스트 */}
          <AdminOptionsTable />

        </section>

      </main>

    </div>
  );
}
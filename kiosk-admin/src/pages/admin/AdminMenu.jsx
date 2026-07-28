import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSummary from "../../components/admin/AdminSummary";
import AdminMenusTable from "../../components/admin/AdminMenusTable";
import AdminOptionsTable from "../../components/admin/AdminOptionsTable";
import ImagePreviewModal from "../../components/admin/ImagePreviewModal";
import useMenuStore from "../../store/menuStore";
import useOptionStore from "../../store/optionStore";
import useAdminOrderStore from "../../store/adminOrderStore";
import "../../styles/AdminMenu.css";
import bunshikLogo from "../../images/bunshiklogo.png";

export default function AdminMenu() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const loadMenus = useMenuStore((state) => state.loadMenus);
  const loadOptions = useOptionStore((state) => state.loadOptions);
  const loadOrders = useAdminOrderStore((state) => state.loadOrders);

  useEffect(() => {
    loadMenus();
    loadOptions();
    loadOrders();
  }, [loadMenus, loadOptions, loadOrders]);

  //로그아웃
  const handleLogout = () => {
    // JWT 삭제
    sessionStorage.removeItem("accessToken");

    // 로그인 상태 삭제
    sessionStorage.removeItem("isAdminLoggedIn");

    navigate("/adminlogin");
  };

  const handleImageClick = (imageUrl, alt) => {
    if (!imageUrl) return;
    setPreviewImage({ imageUrl, alt });
  };

  return (
    <div className="admin-menu-page">
      <header className="admin-header">
        <div className="admin-title">
          <img src={bunshikLogo} alt="분식 로고" className="admin-logo" />

          <h1>관리자 메뉴 관리</h1>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </header>

      <main className="admin-layout">
        <section className="left-panel">
          <AdminSummary onMoveOrder={() => navigate("/adminorder")} />
        </section>

        <section className="right-panel">
          <AdminMenusTable onImageClick={handleImageClick} />
          <AdminOptionsTable onImageClick={handleImageClick} />
        </section>
      </main>

      <ImagePreviewModal
        imageUrl={previewImage?.imageUrl}
        alt={previewImage?.alt}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}

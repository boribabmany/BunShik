import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSummary from "../../components/admin/menu/AdminSummary";
import AdminMenusTable from "../../components/admin/menu/AdminMenusTable";
import AdminOptionsTable from "../../components/admin/menu/AdminOptionsTable";
import ImagePreviewModal from "../../components/admin/shared/ImagePreviewModal";
import useMenuStore from "../../store/menuStore";
import useOptionStore from "../../store/optionStore";
import useAdminOrderStore from "../../store/adminOrderStore";
import "../../styles/AdminMenu.css";
import bunshikLogo from "../../images/bunshiklogo.png";

export default function AdminMenu() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [loadErrors, setLoadErrors] = useState({});
  const [loadingKeys, setLoadingKeys] = useState(() => new Set());
  const loadMenus = useMenuStore((state) => state.loadMenus);
  const loadOptions = useOptionStore((state) => state.loadOptions);
  const loadOrders = useAdminOrderStore((state) => state.loadOrders);

  const loadData = useCallback(async (key, loader) => {
    setLoadingKeys((previous) => new Set(previous).add(key));
    setLoadErrors((previous) => ({ ...previous, [key]: null }));
    try {
      await loader();
    } catch (error) {
      setLoadErrors((previous) => ({ ...previous, [key]: true }));
    } finally {
      setLoadingKeys((previous) => {
        const next = new Set(previous);
        next.delete(key);
        return next;
      });
    }
  }, []);

  useEffect(() => {
    loadData("menus", loadMenus);
    loadData("options", loadOptions);
    loadData("orders", loadOrders);
  }, [loadData, loadMenus, loadOptions, loadOrders]);

  const dataSources = [
    { key: "menus", label: "메뉴", loader: loadMenus },
    { key: "options", label: "옵션", loader: loadOptions },
    { key: "orders", label: "주문", loader: loadOrders },
  ];
  const failedSources = dataSources.filter(({ key }) => loadErrors[key]);

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

      {failedSources.length > 0 && (
        <section className="admin-data-errors" role="alert" aria-label="데이터 조회 오류">
          <strong>일부 데이터를 불러오지 못했습니다.</strong>
          <div>
            {failedSources.map(({ key, label, loader }) => (
              <button
                type="button"
                key={key}
                disabled={loadingKeys.has(key)}
                onClick={() => loadData(key, loader)}
              >
                {loadingKeys.has(key) ? `${label} 재시도 중...` : `${label} 다시 시도`}
              </button>
            ))}
          </div>
        </section>
      )}

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

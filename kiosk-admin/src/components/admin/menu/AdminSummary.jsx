import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useMenuStore from "../../../store/menuStore";
import useOptionStore from "../../../store/optionStore";
import useSalesStore from "../../../store/salesStore";
import UpdateHistory from "./UpdateHistory";

export default function AdminSummary({ onMoveOrder }) {
  const navigate = useNavigate();

  const menuList = useMenuStore((state) => state.menuList);
  const optionList = useOptionStore((state) => state.optionList);
  const salesSummary = useSalesStore((state) => state.salesSummary);
  const loadSalesSummary = useSalesStore((state) => state.loadSalesSummary);

  useEffect(() => {
    loadSalesSummary();
  }, [loadSalesSummary]);

  /* ==========================================
      실시간 데이터 통계 계산
     ========================================== */

  // 총 메뉴 수
  const totalMenus = menuList.length;

  // 총 옵션 수
  const totalOptions = optionList.length;

  const menuStoppedCount = menuList.filter(
    (menu) => menu.is_visible === false,
  ).length;
  const menuSoldOutCount = menuList.filter(
    (menu) => menu.is_visible !== false && menu.is_available === false,
  ).length;
  const optionStoppedCount = optionList.filter(
    (option) => option.is_visible === false,
  ).length;
  const optionSoldOutCount = optionList.filter(
    (option) =>
      option.is_visible !== false && option.option_is_available === false,
  ).length;

  // 매출 대시보드와 동일한 완료 주문 기준 요약
  const todayOrdersCount = salesSummary?.todayOrders ?? 0;
  const todaySales = salesSummary?.todaySales ?? 0;

  return (
    <div className="admin-summary">
      <h2 className="summary-title">메뉴 관리</h2>

      <div className="summary-card">
        <p>메뉴 운영 현황</p>
        <div className="summary-card-row">
          <strong>전체 {totalMenus}개</strong>
          <div className="summary-status-tags" aria-label="메뉴 판매 상태">
            <span className="summary-stopped">중단 {menuStoppedCount}</span>
            <span className="summary-soldout">품절 {menuSoldOutCount}</span>
          </div>
        </div>
      </div>

      <div className="summary-card">
        <p>옵션 운영 현황</p>
        <div className="summary-card-row">
          <strong>전체 {totalOptions}개</strong>
          <div className="summary-status-tags" aria-label="옵션 판매 상태">
            <span className="summary-stopped">중단 {optionStoppedCount}</span>
            <span className="summary-soldout">품절 {optionSoldOutCount}</span>
          </div>
        </div>
      </div>

      <div className="summary-card">
        <p>오늘의 주문</p>
        <strong>{todayOrdersCount}건</strong>
      </div>

      <div className="summary-card sales-card">
        <p>오늘의 매출</p>

        <div className="sales-row">
          <strong>{(todaySales || 0).toLocaleString()}원</strong>

          <button
            className="sales-dashboard-btn"
            onClick={() => navigate("/adminsales")}
          >
            매출 대시보드 자세히보기
          </button>
        </div>
      </div>

      <button className="summary-btn" onClick={onMoveOrder}>
        주문관리로 가기
      </button>

      <div className="add-btn-group">
        <button
          className="summary-btn add-btn"
          onClick={() =>
            navigate("/adminmenuedit", {
              state: {
                type: "menu",
                isAddMode: true,
              },
            })
          }
        >
          + 메뉴 등록
        </button>

        <button
          className="summary-btn add-btn"
          onClick={() =>
            navigate("/adminmenuedit", {
              state: {
                type: "option",
                isAddMode: true,
              },
            })
          }
        >
          + 옵션 등록
        </button>
      </div>

      <UpdateHistory />
    </div>
  );
}

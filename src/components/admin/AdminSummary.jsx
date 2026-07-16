import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import useMenuStore from "../../store/menuStore"; 
import useAdminOrderStore from "../../store/adminOrderStore"; 
import useOptionStore from "../../store/optionStore"; 
import UpdateHistory from "./UpdateHistory";
export default function AdminSummary({ onMoveOrder }) {
  const navigate = useNavigate();

  const { menuList, loadMenus } = useMenuStore();
  const { optionList, loadOptions } = useOptionStore(); 
    // 4. 오늘의매출 (안전하게 예외 처리 적용)
  const { orders, loadOrders, todaySales } = useAdminOrderStore();
  
  useEffect(() => {
    if (loadMenus) loadMenus();
    if (loadOrders) loadOrders();
    if (loadOptions) loadOptions(); 
  }, [loadMenus, loadOrders, loadOptions]);

  /* ==========================================
    실시간 데이터 통계 계산 (핵심 로직)
     ========================================== */

  // 1. 총 메뉴 수 계산
  const totalMenus = menuList ? menuList.length : 0;
  // 2. 등록된 총 옵션 수 계산 (옵션스토어의 optionList 기준)
  const totalOptions = optionList ? optionList.length : 0;
  // 3. 오늘의 주문 수 계산 (임시 오늘 날짜 기준 "2025-05-20")
  const todayDate = "2025-05-20"; 
  const todayOrdersCount = orders 
    ? orders.filter(o => o.created_at?.startsWith(todayDate)).length : 0;
    
  return (
    <div className="admin-summary">
      <h2 className="summary-title">메뉴 관리</h2>

      <div className="summary-card">
        <p>등록된 메인메뉴 수</p>
        <strong>{totalMenus}개</strong>
      </div>

      <div className="summary-card">
        <p>등록된 옵션 수</p>
        <strong>{totalOptions}개</strong>
      </div>

      <div className="summary-card">
        <p>오늘의 주문</p>
        <strong>{todayOrdersCount}건</strong>
      </div>

      <div className="summary-card">
        <p>오늘의 매출</p>
        <strong>{todaySales.toLocaleString()}원</strong>
      </div>

      <button className="summary-btn" onClick={onMoveOrder} >
        주문관리로 가기
      </button>

      <div className="add-btn-group">
      <button className="summary-btn add-btn" onClick={() => navigate("/adminmenuedit", { state: {
                        type: "menu", isAddMode: true, },})}>
              + 메뉴 등록
      </button>
      <button className="summary-btn add-btn" onClick={() => navigate("/adminmenuedit", { state: {
                        type: "option", isAddMode: true,},})}>
              + 옵션 등록
      </button>
      </div>
      <UpdateHistory />
    </div>
  );
}
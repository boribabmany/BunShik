// adminmenu 왼쪽 영역
// adminmenu 왼쪽 영역

import { useNavigate } from "react-router-dom";
import UpdateHistory from "./UpdateHistory";

export default function AdminSummary({ onMoveOrder }) {
  const navigate = useNavigate();

  return (
    <div className="admin-summary">
      <h2 className="summary-title">메뉴 관리</h2>

      <div className="summary-card">
        <p>총 메뉴 수</p>
        <strong>9</strong>
      </div>

      <div className="summary-card">
        <p>품절 메뉴</p>
        <strong>1</strong>
      </div>

      <div className="summary-card">
        <p>오늘의 인기</p>
        <strong>떡볶이</strong>
      </div>

      <div className="summary-card">
        <p>신규 메뉴</p>
        <strong>라면</strong>
      </div>

      <button
        className="summary-btn"
        onClick={onMoveOrder}
      >
        주문관리로 가기
      </button>

      <button
        className="summary-btn add-btn"
        onClick={() => navigate("/adminmenuedit")}
      >
        + 메뉴 등록
      </button>

      <UpdateHistory />
    </div>
  );
}
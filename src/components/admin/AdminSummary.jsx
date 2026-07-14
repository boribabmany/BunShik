// adminmenu 왼쪽 영역
// 백엔드후 historyAPI.js 작성후 axiosInstance로 변경 예정

import { useNavigate } from "react-router-dom";

export default function AdminSummary({ onMoveOrder }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2>메뉴 관리</h2>
      <div>
        <p>총 메뉴 수</p>
        <strong>9</strong>
      </div>

      <div>
        <p>품절 메뉴</p>
        <strong>1</strong>
      </div>

      <div>
        <p>오늘의 인기</p>
        <strong>떡볶이</strong>
      </div>

      <div>
        <p>신규 메뉴</p>
        <strong>라면</strong>
      </div>

      <button onClick={onMoveOrder}>
        주문관리로 가기
      </button>
      <button onClick={() => navigate("/adminmenuedit")}>
        + 메뉴 등록
      </button>

      <div>
        <h3>최근 변경 내역</h3>

        <p>어제 떡볶이 가격 수정</p>
        <p>김밥 가격조정</p>
        <p>콜라 품절 처리</p>
      </div>
    </div>
  );
}
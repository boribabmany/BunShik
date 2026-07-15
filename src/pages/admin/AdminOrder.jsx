import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useOrderStore from "../../store/orderStore";
import "../../styles/AdminOrder.css";

export default function AdminOrder() {
  const navigate = useNavigate();
  // 스토어에서 상태와 액션 가져오기
  const { orders, loadOrders, changeOrderStatus, cancelOrder: storeCancelOrder } = useOrderStore();
  const [date, setDate] = useState("2025-05-20");
  const [type, setType] = useState("전체");
  const [status, setStatus] = useState("전체");

// 페이지 진입 시 주문 목록 로드
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // 검색 기능
  const filteredOrders = orders.filter((order) => {
  const matchDate = order.created_at.startsWith(date);
  const matchType = type === "전체" || order.order_type === type;
  const matchStatus = status === "전체" || order.order_status === status;
  return matchDate && matchType && matchStatus;
})
  .sort((a, b) => b.order_id - a.order_id);

  //상태 변경 버튼 클릭 시 (접수 -> 조리중 -> 완료 동적 처리)
  const handleStatusChange = async (orderNumber) => {
  // API와 스토어가 알아서 다음 단계를 계산하므로 주문번호만 던지면됨
  await changeOrderStatus(orderNumber);
};
// 주문 취소 처리
  const handleCancel = async (orderNumber) => {
    if (!window.confirm("주문을 취소하시겠습니까?")) return;
    await storeCancelOrder(orderNumber);
  };

  return (
    <div className="admin-order-page">
      <header className="order-header">
        <h1>관리자 주문 관리</h1>
        <h3>상태: 완료는 취소불가</h3>
      </header>
      
      {/* 검색 영역 */}
      <section className="search-area">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>전체</option>
          <option>매장</option>
          <option>포장</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>전체</option>
          <option>접수</option>
          <option>조리중</option>
          <option>완료</option>
          <option>취소</option>
        </select>
        <button className="search-btn">검색</button>
      </section>

      {/* 주문 테이블 */}
      <div className="order-table-box">
        <table className="order-table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>주문시간</th>
              <th>주문유형</th>
              <th>상태</th>
              <th>주문금액</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_number}</td>
                <td>{order.created_at}</td>
                <td>{order.order_type}</td>
                <td>{order.order_status}</td>
                <td>{order.total_price.toLocaleString()}원</td>
                <td>
                  <div className="order-action">
                    {/*  버그 수정을 위해 order_status를 인자로 함께 넘겨줍니다 */}
                    <button
                      onClick={() => handleStatusChange(order.order_number, order.order_status)}
                      disabled={
                        order.order_status === "완료" ||
                        order.order_status === "취소"
                      }
                    >
                      {order.order_status === "접수"
                        ? "조리 시작"
                        : order.order_status === "조리중"
                        ? "조리 완료"
                        : "완료"}
                    </button>

                    <button 
                      onClick={() => handleCancel(order.order_number)} 
                      disabled={
                        order.order_status === "완료" ||
                        order.order_status === "취소"
                      }
                    >
                      취소
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>    
        </table>
        
        <button className="load-more"> 더 보기 (Load More)</button>
        
        <div className="bottom-area">
          <button className="back-btn" onClick={() => navigate("/adminmenu")}> 뒤로가기 </button>
        </div>
      </div>
    </div>
  );
}
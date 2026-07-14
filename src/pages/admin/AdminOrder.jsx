import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {getOrders,updateOrderStatus,cancelOrder,} from "../../api/orderApi";
import "../../styles/AdminOrder.css";
export default function AdminOrder() {

  const navigate = useNavigate();

  const [date, setDate] = useState("2025-05-20");
  const [type, setType] = useState("전체");
  const [status, setStatus] = useState("전체");

  // 임시 주문 데이터 (DB 상태값 기준)
  const [orders, setOrders] = useState([]);

useEffect(() => {
  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  fetchOrders();
}, []);


  // 검색 기능
 const filteredOrders = orders.filter((order) => {
  const matchDate = order.created_at.startsWith(date);

  const matchType =
    type === "전체" || order.order_type === type;

  const matchStatus =
    status === "전체" || order.order_status === status;

  return matchDate && matchType && matchStatus;
});

  // 상태 변경 버튼
  const handleStatusChange = async(orderNumber) => {
 await updateOrderStatus(orderNumber, "조리중");

const data = await getOrders();
setOrders(data);
};
//취소
  const handleCancel = async (orderNumber) => {
  if (!window.confirm("주문을 취소하시겠습니까?")) return;
 await cancelOrder(orderNumber);

const data = await getOrders();
setOrders(data);
};
  return (
    <div className="admin-order-page">
      <header className="order-header">
        <h1>관리자 주문 관리</h1>
      </header>
      {/* 검색 영역 */}
      <section className="search-area">
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}/>

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
        <button className="search-btn">
          검색
        </button>
      </section>

      {/* 주문 테이블 */}
      <div className="order-table-box">
      <table  className="order-table" /*border="1"*/>
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
        <button
          onClick={() => handleStatusChange(order.order_number)}
          disabled={
            order.order_status === "완료" ||
            order.order_status === "취소"
          }>
          {order.order_status === "접수"
            ? "조리 시작"
            : order.order_status === "조리중"
            ? "조리 완료"
            : "완료"}
        </button>

        <button onClick={() => handleCancel(order.order_number)} disabled={
            order.order_status === "완료" ||
            order.order_status === "취소"}>
              취소
        </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>   
      </table>
      {/* 더보기 */}
      <button className="load-more"> 더 보기 (Load More)</button>
      {/* 뒤로가기 */}
      <div className="bottom-area">
      <button  className="back-btn" onClick={()=>navigate("/adminmenu")}> 뒤로가기 </button>
    </div>
    </div>
    </div>
  );
}
//DB 적용되면 변경예정 임시, 더보기 기능은 db들어오고나서 조정이 수월하다판단
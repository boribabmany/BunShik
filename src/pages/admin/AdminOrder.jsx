import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminOrder() {

  const navigate = useNavigate();

  const [date, setDate] = useState("2025-05-20");
  const [type, setType] = useState("전체");
  const [status, setStatus] = useState("전체");

  // 임시 주문 데이터 (DB 상태값 기준)
  const [orders, setOrders] = useState([
  {
    order_id: 1,
    order_number: "A-001",
    created_at: "2025-05-20 11:30",
    order_type: "포장",
    order_status: "완료",
    total_price: 9500,
  },
  {
    order_id: 2,
    order_number: "A-002",
    created_at: "2025-05-20 12:20",
    order_type: "매장",
    order_status: "완료",
    total_price: 10000,
  },
  {
    order_id: 3,
    order_number: "A-003",
    created_at: "2025-05-20 13:05",
    order_type: "포장",
    order_status: "접수",
    total_price: 8000,
  },
  {
    order_id: 4,
    order_number: "A-004",
    created_at: "2025-05-20 14:05",
    order_type: "포장",
    order_status: "조리중",
    total_price: 10000,
  },
  {
    order_id: 5,
    order_number: "A-005",
    created_at: "2025-05-20 14:50",
    order_type: "매장",
    order_status: "취소",
    total_price: 12000,
  },
]);
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
  const handleStatusChange = (orderNumber) => {
  setOrders((prev) =>
    prev.map((order) => {
      if (order.order_number !== orderNumber) return order;

      if (order.order_status === "접수") {
        return { ...order, order_status: "조리중" };
      }

      if (order.order_status === "조리중") {
        return { ...order, order_status: "완료" };
      }

      return order;
    })
  );
};
//취소
const handleCancel = (orderNumber) => {
  if (!window.confirm("주문을 취소하시겠습니까?")) return;

  setOrders((prev) =>
    prev.map((order) =>
      order.order_number === orderNumber
        ? { ...order, order_status: "취소" }
        : order
    )
  );
};
  return (
    <div>
      <header>
        <h1>관리자 주문 관리</h1>
      </header>
      {/* 검색 영역 */}
      <section>
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
        <button>
          검색
        </button>
      </section>

      {/* 주문 테이블 */}
      <table border="1">
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
        <button
          onClick={() => handleStatusChange(order.order_number)}
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
          }>
          취소
        </button>
      </td>
    </tr>
  ))}
</tbody>   
      </table>
      {/* 더보기 */}
      <button> 더 보기 (Load More)</button>
      {/* 뒤로가기 */}
      <button onClick={()=>navigate("/adminmenu")}> 뒤로가기 </button>
    </div>
  );
}
//DB 적용되면 변경예정 임시, 더보기 기능은 db들어오고나서 조정이 수월하다판단
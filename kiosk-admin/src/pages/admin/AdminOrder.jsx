import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAdminOrderStore from "../../store/adminOrderStore";
import "../../styles/AdminOrder.css";
import bunshikLogo from "../../images/bunshiklogo.png";

export default function AdminOrder() {
  const navigate = useNavigate();

  const {
    orders,
    loadOrders,
    changeOrderStatus,
    cancelOrder: storeCancelOrder,
  } = useAdminOrderStore();

  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [type, setType] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = orders
    .filter((order) => {
      const matchDate =
        date === "" || order.created_at.startsWith(date);

      const matchType =
        type === "전체" || order.order_type === type;

      const matchStatus =
        status === "전체" || order.order_status === status;

      return matchDate && matchType && matchStatus;
    })
    .sort((a, b) => b.order_id - a.order_id);

  // 상태 변경: 접수 → 조리중 → 완료
  const handleStatusChange = async (
    orderId,
    currentStatus
  ) => {
    let nextStatus;

    if (currentStatus === "접수") {
      nextStatus = "조리중";
    } else if (currentStatus === "조리중") {
      nextStatus = "완료";
    } else {
      return;
    }

    await changeOrderStatus(orderId, nextStatus);
  };

  // 주문 취소
  const handleCancel = async (orderId) => {
    if (!window.confirm("주문을 취소하시겠습니까?")) {
      return;
    }

    await storeCancelOrder(orderId);
  };

  // 주문 상태에 따른 버튼 문구
  const getStatusButtonText = (orderStatus) => {
    if (orderStatus === "접수") {
      return "조리 시작";
    }

    if (orderStatus === "조리중") {
      return "조리 완료";
    }

    if (orderStatus === "취소") {
      return "취소됨";
    }

    return "완료됨";
  };

  return (
    <div className="admin-order-page">
      <header className="order-header">
        <div className="order-title">
          <img
            src={bunshikLogo}
            alt="분식로고"
            className="order-logo"
          />

          <div>
            <h1>관리자 주문 관리</h1>
            <h3>상태: 완료는 취소불가</h3>
          </div>
        </div>
      </header>

      <section className="search-area">
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setVisibleCount(5);
          }}
        />

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setVisibleCount(5);
          }}
        >
          <option value="전체">전체</option>
          <option value="매장">매장</option>
          <option value="포장">포장</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setVisibleCount(5);
          }}
        >
          <option value="전체">전체</option>
          <option value="접수">접수</option>
          <option value="조리중">조리중</option>
          <option value="완료">완료</option>
          <option value="취소">취소</option>
        </select>

        <button
          type="button"
          className="search-btn"
        >
          검색
        </button>
      </section>

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
            {filteredOrders
              .slice(0, visibleCount)
              .map((order) => {
                const isFinished =
                  order.order_status === "완료" ||
                  order.order_status === "취소";

                return (
                  <tr key={order.order_id}>
                    <td>{order.order_number}</td>
                    <td>{order.created_at}</td>
                    <td>{order.order_type}</td>
                    <td>{order.order_status}</td>
                    <td>
                      {order.total_price.toLocaleString()}원
                    </td>

                    <td>
                      <div className="order-action">
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              order.order_id,
                              order.order_status
                            )
                          }
                          disabled={isFinished}
                        >
                          {getStatusButtonText(
                            order.order_status
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleCancel(order.order_id)
                          }
                          disabled={isFinished}
                        >
                          취소
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="empty-order">
            조회된 주문이 없습니다.
          </div>
        )}

        {visibleCount < filteredOrders.length && (
          <button
            type="button"
            className="load-more"
            onClick={() =>
              setVisibleCount((prev) => prev + 5)
            }
          >
            더 보기
          </button>
        )}

        <div className="bottom-area">
          <button
            type="button"
            className="order-back-btn"
            onClick={() => navigate("/adminmenu")}
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
}
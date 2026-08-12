import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useRef, useState } from "react";
import useAdminOrderStore from "../../store/adminOrderStore";
import { getOrderDetail } from "../../api/adminOrderApi";
import { getKoreaDateString } from "../../utils/date";
import { playNewOrderSound } from "../../utils/newOrderSound";
import "../../styles/AdminOrder.css";
import bunshikLogo from "../../images/bunshiklogo.png";

const SOUND_SETTING_KEY = "adminOrderSoundEnabled";

export default function AdminOrder() {
  const navigate = useNavigate();

  const {
    orders,
    loadOrders,
    changeOrderStatus,
    cancelOrder: storeCancelOrder,
  } = useAdminOrderStore();

  const [date, setDate] = useState(getKoreaDateString());
  const [type, setType] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [visibleCount, setVisibleCount] = useState(5);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [detailLoadingId, setDetailLoadingId] = useState(null);
  const [detailErrorId, setDetailErrorId] = useState(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(
    () => sessionStorage.getItem(SOUND_SETTING_KEY) === "true",
  );
  const [unreadOrderIds, setUnreadOrderIds] = useState(() => new Set());
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const knownOrderIdsRef = useRef(new Set());
  const isFirstOrderLoadRef = useRef(true);
  const isPollingRef = useRef(false);
  const soundEnabledRef = useRef(isSoundEnabled);

  useEffect(() => {
    let isActive = true;

    const refreshOrders = async () => {
      if (isPollingRef.current) return;

      isPollingRef.current = true;

      try {
        const latestOrders = await loadOrders();

        if (!isActive || !Array.isArray(latestOrders)) return;

        const latestOrderIds = new Set(
          latestOrders.map((order) => order.order_id),
        );
        const activeReceivedOrderIds = new Set(
          latestOrders
            .filter((order) => order.order_status === "접수")
            .map((order) => order.order_id),
        );

        if (!isFirstOrderLoadRef.current) {
          const newOrders = latestOrders.filter(
            (order) =>
              order.order_status === "접수" &&
              !knownOrderIdsRef.current.has(order.order_id),
          );

          const hasNewOrder = newOrders.length > 0;

          setUnreadOrderIds((previousIds) => {
            const nextIds = new Set(
              [...previousIds].filter((orderId) =>
                activeReceivedOrderIds.has(orderId),
              ),
            );
            newOrders.forEach((order) => nextIds.add(order.order_id));
            return nextIds;
          });

          if (hasNewOrder && soundEnabledRef.current) {
            playNewOrderSound().catch((error) => {
              console.warn("신규 주문 알림음 재생 실패:", error);
            });
          }
        }

        knownOrderIdsRef.current = latestOrderIds;
        isFirstOrderLoadRef.current = false;
      } catch (error) {
        console.error("주문 자동 갱신 실패:", error);
      } finally {
        isPollingRef.current = false;
      }
    };

    refreshOrders();
    const intervalId = setInterval(refreshOrders, 5000);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [loadOrders]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  const markOrderAsRead = (orderId) => {
    setUnreadOrderIds((previousIds) => {
      if (!previousIds.has(orderId)) return previousIds;

      const nextIds = new Set(previousIds);
      nextIds.delete(orderId);
      return nextIds;
    });
  };

  const isDelayedOrder = (order) => {
    if (order.order_status !== "접수") return false;

    const createdAt = new Date(order.created_at.replace(" ", "T")).getTime();
    return Number.isFinite(createdAt) && currentTime - createdAt >= 10 * 60 * 1000;
  };

  const handleSoundToggle = async () => {
    if (soundEnabledRef.current) {
      soundEnabledRef.current = false;
      setIsSoundEnabled(false);
      sessionStorage.removeItem(SOUND_SETTING_KEY);
      return;
    }

    try {
      await playNewOrderSound();
      soundEnabledRef.current = true;
      setIsSoundEnabled(true);
      sessionStorage.setItem(SOUND_SETTING_KEY, "true");
    } catch (error) {
      console.error("알림음 활성화 실패:", error);
      alert("브라우저에서 알림음을 켜지 못했습니다.");
    }
  };

  const handleOrderRowClick = async (orderId) => {
    markOrderAsRead(orderId);

    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);
    setDetailErrorId(null);

    if (orderDetails[orderId]) {
      return;
    }

    setDetailLoadingId(orderId);

    try {
      const detail = await getOrderDetail(orderId);
      setOrderDetails((prev) => ({ ...prev, [orderId]: detail }));
    } catch (error) {
      console.error("주문 상세 조회 실패:", error);
      setDetailErrorId(orderId);
    } finally {
      setDetailLoadingId(null);
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      const matchDate = date === "" || order.created_at.startsWith(date);

      const matchType = type === "전체" || order.order_type === type;

      const matchStatus = status === "전체" || order.order_status === status;

      return matchDate && matchType && matchStatus;
    })
    .sort((a, b) => b.order_id - a.order_id);

  const delayedOrderCount = filteredOrders.filter(isDelayedOrder).length;

  // 상태 변경: 접수 → 조리중 → 완료
  const handleStatusChange = async (orderId, currentStatus) => {
    let nextStatus;

    if (currentStatus === "접수") {
      nextStatus = "조리중";
    } else if (currentStatus === "조리중") {
      nextStatus = "완료";
    } else {
      return;
    }

    try {
      await changeOrderStatus(orderId, nextStatus);
      markOrderAsRead(orderId);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "주문 상태를 변경하지 못했습니다.",
      );
    }
  };

  // 주문 취소
  const handleCancel = async (orderId) => {
    if (
      !window.confirm(
        "주문을 취소하시겠습니까?\n결제 완료 건은 자동으로 전액 환불됩니다.",
      )
    ) {
      return;
    }

    try {
      await storeCancelOrder(orderId);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "주문 취소 또는 결제 환불에 실패했습니다.",
      );
    }
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
          <img src={bunshikLogo} alt="분식로고" className="order-logo" />

          <div>
            <h1>관리자 주문 관리</h1>
            <h3>상태: 완료는 취소불가</h3>
          </div>
        </div>

        <div className="order-live-controls">
          <span
            className={`new-order-count ${unreadOrderIds.size > 0 ? "active" : ""}`}
            aria-live="polite"
          >
            신규 {unreadOrderIds.size}건
          </span>
          <span className="auto-refresh-status">5초마다 자동 갱신</span>
          <button
            type="button"
            className={`sound-toggle ${isSoundEnabled ? "enabled" : ""}`}
            aria-pressed={isSoundEnabled}
            onClick={handleSoundToggle}
          >
            {isSoundEnabled ? "알림음 끄기" : "알림음 켜기"}
          </button>
        </div>
      </header>

      {delayedOrderCount > 0 && (
        <div className="delayed-order-alert" role="status">
          <strong>처리 지연 {delayedOrderCount}건</strong>
          <span>접수 후 10분이 지난 주문을 확인해 주세요.</span>
        </div>
      )}

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

      </section>

      <div className="order-table-box">
        <table className="order-table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>주문시간</th>
              <th>주문유형</th>
              <th>결제방법</th>
              <th>상태</th>
              <th>주문금액</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.slice(0, visibleCount).map((order) => {
              const isFinished =
                order.order_status === "완료" || order.order_status === "취소";
              const isExpanded = expandedOrderId === order.order_id;
              const detail = orderDetails[order.order_id];
              const isUnread = unreadOrderIds.has(order.order_id);
              const isDelayed = isDelayedOrder(order);

              return (
                <Fragment key={order.order_id}>
                <tr
                  className={`order-row ${isExpanded ? "expanded" : ""} ${isUnread ? "unread" : ""} ${isDelayed ? "delayed" : ""}`}
                  onClick={() => handleOrderRowClick(order.order_id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOrderRowClick(order.order_id);
                    }
                  }}
                  tabIndex={0}
                  aria-expanded={isExpanded}
                >
                  <td>
                    <div className="order-number-cell">
                      <span>{order.order_number}</span>
                      {isUnread && <span className="new-order-badge">신규</span>}
                      {isDelayed && <span className="delayed-order-badge">지연</span>}
                    </div>
                  </td>
                  <td>{order.created_at}</td>
                  <td>{order.order_type}</td>
                  <td>{order.payment_method}</td>
                  <td>{order.order_status}</td>
                  <td>{order.total_price.toLocaleString()}원</td>

                  <td>
                    <div className="order-action">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(
                            order.order_id,
                            order.order_status,
                          );
                        }}
                        disabled={isFinished}
                      >
                        {getStatusButtonText(order.order_status)}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(order.order_id);
                        }}
                        disabled={isFinished}
                      >
                        취소
                      </button>
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="order-detail-row">
                    <td colSpan="7">
                      <div className="order-detail-panel">
                        {detailLoadingId === order.order_id && (
                          <p className="order-detail-message">
                            주문 상세를 불러오는 중입니다.
                          </p>
                        )}

                        {detailErrorId === order.order_id && (
                          <p className="order-detail-message error">
                            주문 상세를 불러오지 못했습니다.
                          </p>
                        )}

                        {detail && (
                          <>
                            <div className="order-detail-heading">
                              <strong>주문 상세</strong>
                              <span>
                                {detail.order_number} · {detail.order_type} · 결제: {detail.payment_method}
                              </span>
                            </div>

                            <div className="order-detail-items">
                              {detail.items.length > 0 ? (
                                detail.items.map((item) => (
                                  <div
                                    className="order-detail-item"
                                    key={item.order_item_id}
                                  >
                                    <div className="order-detail-item-main">
                                      <strong>{item.menu_name}</strong>
                                      <span>{item.quantity}개</span>
                                      <span>
                                        {(
                                          item.unit_price * item.quantity
                                        ).toLocaleString()}
                                        원
                                      </span>
                                    </div>

                                    {item.components.length > 0 && (
                                      <div className="order-detail-components">
                                        <strong>세트 구성</strong>
                                        {item.components.map((component) => (
                                          <span
                                            key={
                                              component.component_menu_id
                                            }
                                          >
                                            {component.component_menu_name}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {item.options.length > 0 && (
                                      <div className="order-detail-options">
                                        {item.options.map((option) => (
                                          <span key={option.option_id}>
                                            + {option.option_name} (
                                            {option.option_price.toLocaleString()}
                                            원)
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <p className="order-detail-message">
                                  주문 메뉴가 없습니다.
                                </p>
                              )}
                            </div>

                            <div className="order-detail-total">
                              <span>총 결제금액</span>
                              <strong>
                                {detail.total_price.toLocaleString()}원
                              </strong>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                </Fragment>
              );
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="empty-order">조회된 주문이 없습니다.</div>
        )}

        {visibleCount < filteredOrders.length && (
          <button
            type="button"
            className="load-more"
            onClick={() => setVisibleCount((prev) => prev + 5)}
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

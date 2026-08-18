import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAdminOrderStore from "../../../store/adminOrderStore";
import { playNewOrderSound } from "../../../utils/newOrderSound";
import "../../../styles/NewOrderToast.css";

const SOUND_SETTING_KEY = "adminOrderSoundEnabled";
const POLLING_INTERVAL = 5000;
const TOAST_DURATION = 8000;

export default function NewOrderToast() {
  const navigate = useNavigate();
  const location = useLocation();
  const orders = useAdminOrderStore((state) => state.orders);
  const loadOrders = useAdminOrderStore((state) => state.loadOrders);
  const [newOrders, setNewOrders] = useState([]);
  const knownOrderIdsRef = useRef(new Set());
  const hasBaselineRef = useRef(false);
  const isPollingRef = useRef(false);

  useEffect(() => {
    if (location.pathname === "/adminorder") return undefined;

    const refreshOrders = async () => {
      if (isPollingRef.current) return;

      isPollingRef.current = true;
      try {
        const latestOrders = await loadOrders();

        if (!hasBaselineRef.current && Array.isArray(latestOrders)) {
          knownOrderIdsRef.current = new Set(
            latestOrders.map((order) => order.order_id),
          );
          hasBaselineRef.current = true;
        }
      } catch (error) {
        console.error("신규 주문 확인 실패:", error);
      } finally {
        isPollingRef.current = false;
      }
    };

    refreshOrders();
    const intervalId = setInterval(refreshOrders, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [loadOrders, location.pathname]);

  useEffect(() => {
    const latestOrderIds = new Set(orders.map((order) => order.order_id));

    if (!hasBaselineRef.current) {
      if (orders.length > 0) {
        knownOrderIdsRef.current = latestOrderIds;
        hasBaselineRef.current = true;
      }
      return;
    }

    const arrivals = orders.filter(
      (order) =>
        order.order_status === "접수" &&
        !knownOrderIdsRef.current.has(order.order_id),
    );

    knownOrderIdsRef.current = latestOrderIds;

    if (arrivals.length === 0) return;

    setNewOrders(arrivals);

    if (
      location.pathname !== "/adminorder" &&
      sessionStorage.getItem(SOUND_SETTING_KEY) === "true"
    ) {
      playNewOrderSound().catch((error) => {
        console.warn("신규 주문 알림음 재생 실패:", error);
      });
    }
  }, [location.pathname, orders]);

  useEffect(() => {
    if (newOrders.length === 0) return undefined;

    const timeoutId = setTimeout(() => setNewOrders([]), TOAST_DURATION);
    return () => clearTimeout(timeoutId);
  }, [newOrders]);

  if (newOrders.length === 0) return null;

  const latestOrder = newOrders[0];
  const title =
    newOrders.length === 1
      ? `신규 주문 ${latestOrder.order_number}`
      : `신규 주문 ${newOrders.length}건`;

  return (
    <aside className="new-order-toast" role="status" aria-live="assertive">
      <button
        type="button"
        className="new-order-toast-main"
        onClick={() => {
          setNewOrders([]);
          navigate("/adminorder");
        }}
      >
        <span className="new-order-toast-dot" aria-hidden="true" />
        <span>
          <strong>{title}</strong>
          <small>
            {latestOrder.order_type} · {latestOrder.total_price.toLocaleString()}원
            {newOrders.length > 1 ? " 외" : ""}
          </small>
        </span>
      </button>
      <button
        type="button"
        className="new-order-toast-close"
        aria-label="신규 주문 알림 닫기"
        onClick={() => setNewOrders([])}
      >
        ×
      </button>
    </aside>
  );
}

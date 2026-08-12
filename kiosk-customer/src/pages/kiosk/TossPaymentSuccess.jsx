import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import useOrderStore from "../../store/useOrderStore";
import { confirmTossPayment } from "../../api/orderApi";

function TossPaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  const setOrderNumber = useOrderStore((state) => state.setOrderNumber);
  const setTotalPrice = useOrderStore((state) => state.setTotalPrice);
  const setPendingOrderId = useOrderStore((state) => state.setPendingOrderId);
  const [error, setError] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const isConfirming = useRef(false);
  const paymentMethodLabel = searchParams.get("paymentMethod") || "토스페이";

  const kioskOrderId = Number(searchParams.get("kioskOrderId"));
  const orderNumber = searchParams.get("orderNumber");
  const totalPrice = Number(searchParams.get("totalPrice"));
  const paymentKey = searchParams.get("paymentKey");
  const tossOrderId = searchParams.get("orderId");
  const amount = Number(searchParams.get("amount"));

  // 손님은 토스 결제창에서 이미 결제를 마치고 돌아온 상태다. 여기서 confirm이
  // 실패해도 "다시 결제하기"로 보내면 안 된다 — 실제로는 결제가 이미 됐을 수
  // 있어서 재결제를 유도하면 이중결제 위험이 생긴다. 그래서 실패 시에는
  // 새 결제를 시작할 수 있는 화면으로 이동시키지 않고, 같은 화면에서
  // 재확인(자동 재시도는 confirmTossPayment 내부 withRetry가 처리)하거나
  // 직원을 부르도록 안내한다.
  const runConfirm = useCallback(() => {
    if (isConfirming.current) return;
    isConfirming.current = true;
    setError("");

    confirmTossPayment({
      order_id: kioskOrderId,
      payment_key: paymentKey,
      toss_order_id: tossOrderId,
      amount,
      payment_method: paymentMethodLabel,
    })
      .then(() => {
        setOrderNumber(orderNumber ?? String(kioskOrderId));
        setTotalPrice(totalPrice);
        setPendingOrderId(null);
        clearCart();
        navigate("/complete", { replace: true });
      })
      .catch((err) => {
        setError(err.message || "결제 승인 확인이 지연되고 있습니다.");
      })
      .finally(() => {
        isConfirming.current = false;
        setIsRetrying(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    runConfirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualRetry = () => {
    setIsRetrying(true);
    runConfirm();
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      {error ? (
        <>
          <p style={{ color: "red", fontWeight: "bold" }}>
            결제 확인이 지연되고 있습니다.
          </p>
          <p>
            결제가 이미 완료되었을 수 있으니 다시 결제하지 마시고, 아래 정보와
            함께 직원을 불러주세요.
          </p>
          {orderNumber && <p>주문번호: {orderNumber}</p>}
          <p style={{ color: "#888", fontSize: 13 }}>{error}</p>
          <button
            type="button"
            onClick={handleManualRetry}
            disabled={isRetrying}
          >
            {isRetrying ? "다시 확인하는 중..." : "다시 확인하기"}
          </button>
        </>
      ) : (
        <p>결제를 승인하고 있습니다...</p>
      )}
    </div>
  );
}

export default TossPaymentSuccess;

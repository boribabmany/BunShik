import { useEffect, useState } from "react";
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

  useEffect(() => {
    const kioskOrderId = Number(searchParams.get("kioskOrderId"));
    const orderNumber = searchParams.get("orderNumber");
    const totalPrice = Number(searchParams.get("totalPrice"));
    const paymentKey = searchParams.get("paymentKey");
    const tossOrderId = searchParams.get("orderId");
    const amount = Number(searchParams.get("amount"));

    confirmTossPayment({
      order_id: kioskOrderId,
      payment_key: paymentKey,
      toss_order_id: tossOrderId,
      amount,
    })
      .then(() => {
        setOrderNumber(orderNumber ?? String(kioskOrderId));
        setTotalPrice(totalPrice);
        setPendingOrderId(null);
        clearCart();
        navigate("/complete", { replace: true });
      })
      .catch((err) => {
        setError(err.message || "결제 승인에 실패했습니다.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      {error ? (
        <>
          <p style={{ color: "red" }}>{error}</p>
          <button
            type="button"
            onClick={() => navigate("/payment", { replace: true })}
          >
            결제 화면으로 돌아가기
          </button>
        </>
      ) : (
        <p>결제를 승인하고 있습니다...</p>
      )}
    </div>
  );
}

export default TossPaymentSuccess;

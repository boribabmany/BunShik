import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import useOrderStore from "../../store/useOrderStore";
import { submitPayment } from "../../api/orderApi";
import PaymentFailCard from "../../components/kiosk/PaymentFailCard";
import OrderItem from "../../components/kiosk/OrderItem";

function Payment() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const setOrderNumber = useOrderStore((state) => state.setOrderNumber);
  const setTotalPrice = useOrderStore((state) => state.setTotalPrice);

  const [isPaying, setIsPaying] = useState(false);
  const [failType, setFailType] = useState(null);

  // 결제 화면에 진입했을 때 장바구니가 비어있으면 메뉴 화면으로 돌려보냄
  useEffect(() => {
    if (items.length === 0) {
      navigate("/menu", { replace: true });
    }
  }, [items, navigate]);

  const totalPrice = items.reduce((sum, item) => {
    const optionTotal = item.options.reduce((s, o) => s + o.option_price, 0);
    return sum + (item.base_price + optionTotal) * item.quantity;
  }, 0);

  const handlePay = async () => {
    setIsPaying(true);
    setFailType(null);

    try {
      const result = await submitPayment();

      if (result.status === "success") {
        const orderNumber = `A-${Math.floor(Math.random() * 900 + 100)}`;
        setOrderNumber(orderNumber);
        setTotalPrice(totalPrice);
        clearCart();
        navigate("/complete");
      } else {
        setFailType(result.status);
      }
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
      if (error.message === "TIMEOUT") {
        setFailType("timeout");
      } else {
        setFailType("system-error");
      }
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div>
      <h1>주문내역</h1>

      {items.map((item, index) => (
        <OrderItem key={index} item={item} />
      ))}

      <div>
        <p>총 결제 금액</p>
        <p>{totalPrice.toLocaleString()}원</p>
      </div>

      <button type="button" onClick={handlePay} disabled={isPaying}>
        {isPaying ? "결제 중..." : "카드 결제"}
      </button>

      <button type="button" onClick={() => navigate(-1)}>
        뒤로가기
      </button>

      {failType && (
        <PaymentFailCard
          type={failType}
          onRetry={handlePay}
          onBack={() => setFailType(null)}
        />
      )}
    </div>
  );
}

export default Payment;

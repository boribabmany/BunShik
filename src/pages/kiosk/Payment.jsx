import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import useOrderStore from "../../store/useOrderStore";
import { submitPayment } from "../../api/orderApi";
import PaymentFailCard from "../../components/kiosk/PaymentFailCard";

function Payment() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const setOrderNumber = useOrderStore((state) => state.setOrderNumber);
  const setTotalPrice = useOrderStore((state) => state.setTotalPrice);

  const [isPaying, setIsPaying] = useState(false);
  const [failType, setFailType] = useState(null);

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
        setFailType(result.status); // 'card-error' | 'declined'
      }
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);

      // 에러 종류에 따라 다른 팝업 문구를 보여줌
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

      {items.map((item, index) => {
        const optionTotal = item.options.reduce(
          (s, o) => s + o.option_price,
          0,
        );
        const itemTotal = (item.base_price + optionTotal) * item.quantity;

        return (
          <div key={index}>
            <img src={item.image_url} alt={item.menu_name} />
            <span>{item.menu_name}</span>
            <span>{item.quantity}개</span>
            <span>{itemTotal.toLocaleString()}원</span>
          </div>
        );
      })}

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

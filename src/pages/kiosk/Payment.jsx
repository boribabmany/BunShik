import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import useOrderStore from "../../store/useOrderStore";
import { submitPayment } from "../../api/orderApi";
import PaymentFailCard from "../../components/kiosk/PaymentFailCard";
import EmptyCartModal from "../../components/kiosk/EmptyCartModal";
import PaymentItem from "../../components/kiosk/PaymentItem";
import logo from "../../images/bunshiklogo.png";
import cardIcon from "../../images/card.png";
import backIcon from "../../images/backicon.png";
import "../../App.css";

function Payment() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const setOrderNumber = useOrderStore((state) => state.setOrderNumber);
  const setTotalPrice = useOrderStore((state) => state.setTotalPrice);

  const [isPaying, setIsPaying] = useState(false);
  const [failType, setFailType] = useState(null);

  const isCartEmpty = items.length === 0;

  const handleGoToMenu = () => {
    navigate("/menu", { replace: true });
  };

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

  if (isCartEmpty) {
    return <EmptyCartModal onConfirm={handleGoToMenu} />;
  }

  return (
    <div className="payment-screen">
      <img src={logo} alt="분식집 로고" className="menu-logo" />

      <h1 className="payment-title">주문내역</h1>

      <div className="payment-divider-top" />

      <div className="payment-list-wrapper">
        <div className="payment-list">
          {items.map((item, index) => (
            <PaymentItem key={index} item={item} />
          ))}
        </div>
      </div>

      <div className="payment-divider-bottom" />

      <p className="payment-total-label">총 결제 금액</p>
      <p className="payment-total-price">{totalPrice.toLocaleString()}원</p>

      <button
        type="button"
        className="payment-pay-button"
        onClick={handlePay}
        disabled={isPaying}
      >
        <img src={cardIcon} alt="" className="payment-pay-icon" />
        <span className="payment-pay-text">
          {isPaying ? "결제 중..." : "카드 결제"}
        </span>
      </button>

      <button
        type="button"
        className="payment-back-button"
        onClick={() => navigate(-1)}
      >
        <img src={backIcon} alt="" className="payment-back-icon" />
        <span className="payment-back-text">뒤로가기</span>
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

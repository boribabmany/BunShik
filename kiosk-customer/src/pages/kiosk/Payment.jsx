import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import useOrderStore from "../../store/useOrderStore";
import useLanguageStore from "../../store/useLanguageStore";
import { translations, formatPrice } from "../../i18n/translations";
import { createOrder, submitPayment } from "../../api/orderApi";
import PaymentFailCard from "../../components/kiosk/PaymentFailCard";
import EmptyCartModal from "../../components/kiosk/EmptyCartModal";
import PaymentMethodModal from "../../components/kiosk/PaymentMethodModal";
import PaymentItem from "../../components/kiosk/PaymentItem";
import logo from "../../images/bunshiklogo.png";
import backIcon from "../../images/backicon.png";
import "../../styles/common.css";
import "../../styles/Payment.css";
import "../../styles/PaymentMethodModal.css";

function Payment() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const orderType = useOrderStore((state) => state.orderType);
  const setOrderNumber = useOrderStore((state) => state.setOrderNumber);
  const setTotalPrice = useOrderStore((state) => state.setTotalPrice);

  const language = useLanguageStore((state) => state.language);
  const t = translations[language].payment;

  const [isPaying, setIsPaying] = useState(false);
  const [failType, setFailType] = useState(null);
  const [failReason, setFailReason] = useState(null);
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [lastMethod, setLastMethod] = useState("card");

  const isCartEmpty = items.length === 0;
  const totalPrice = getTotalPrice();

  const handleGoToMenu = () => {
    navigate("/menu", { replace: true });
  };

  const handlePay = async (method) => {
    setIsMethodModalOpen(false);
    setIsPaying(true);
    setFailType(null);
    setFailReason(null);
    setLastMethod(method);

    let paymentMethod;

    switch (method) {
      case "card":
        paymentMethod = "카드";
        break;
      case "naverpay":
        paymentMethod = "네이버페이";
        break;
      case "kakaopay":
        paymentMethod = "카카오페이";
        break;
      default:
        paymentMethod = "카드";
    }

    try {
      const orderResult = await createOrder({
        items: items.map((item) => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          option_ids: item.options.map((option) => option.option_id),
        })),
        order_type: orderType === "dine-in" ? "매장" : "포장",
      });

      if (orderResult.status !== "대기") {
        setFailType("order-error");
        setFailReason(orderResult.message ?? null);
        return;
      }

      const paymentResult = await submitPayment({
        order_id: orderResult.order_id,
        payment_method: paymentMethod,
      });

      if (paymentResult.status === "성공") {
        setOrderNumber(orderResult.order_number);
        setTotalPrice(totalPrice);
        clearCart();
        navigate("/complete");
      } else {
        setFailType(paymentResult.status);
        setFailReason(paymentResult.fail_reason ?? null);
      }
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
      setFailReason(null);

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
    return <EmptyCartModal onConfirm={handleGoToMenu} language={language} />;
  }

  return (
    <div className="payment-screen">
      <img src={logo} alt="분식집 로고" className="menu-logo" />

      <h1 className="payment-title">{t.title}</h1>

      <div className="payment-divider-top" />

      <div className="payment-list-wrapper">
        <div className="payment-list">
          {items.map((item, index) => (
            <PaymentItem key={index} item={item} language={language} />
          ))}
        </div>
      </div>

      <div className="payment-divider-bottom" />

      <p className="payment-total-label">{t.totalLabel}</p>

      <p className="payment-total-price">{formatPrice(language, totalPrice)}</p>

      <button
        type="button"
        className="payment-pay-button"
        onClick={() => setIsMethodModalOpen(true)}
        disabled={isPaying}
      >
        <span
          className={`payment-pay-text ${language === "en" ? "lang-en" : ""}`}
        >
          {isPaying ? t.paying : t.selectMethod}
        </span>
      </button>

      <button
        type="button"
        className="payment-back-button"
        onClick={() => navigate(-1)}
      >
        <img src={backIcon} alt="" className="payment-back-icon" />
        <span className="payment-back-text">
          {translations[language].common.back}
        </span>
      </button>

      {isMethodModalOpen && (
        <PaymentMethodModal
          onSelect={handlePay}
          onClose={() => setIsMethodModalOpen(false)}
          language={language}
        />
      )}

      {failType && (
        <PaymentFailCard
          type={failType}
          failReason={failReason}
          onRetry={() => handlePay(lastMethod)}
          onBack={() => setFailType(null)}
          language={language}
        />
      )}
    </div>
  );
}

export default Payment;

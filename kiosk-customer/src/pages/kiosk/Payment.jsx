import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import useOrderStore from "../../store/useOrderStore";
import useLanguageStore from "../../store/useLanguageStore";
import { translations, formatPrice } from "../../i18n/translations";
import {
  createOrder,
  submitPayment,
  cancelOrder,
  withRetry,
} from "../../api/orderApi";
import PaymentFailCard from "../../components/kiosk/PaymentFailCard";
import EmptyCartModal from "../../components/kiosk/EmptyCartModal";
import PaymentMethodModal from "../../components/kiosk/PaymentMethodModal";
import EasyPayQRModal from "../../components/kiosk/EasyPayQRModal";
import PaymentItem from "../../components/kiosk/PaymentItem";
import logo from "../../images/bunshiklogo.png";
import backIcon from "../../images/backicon.png";
import "../../styles/common.css";
import "../../styles/Payment.css";
import "../../styles/PaymentMethodModal.css";

const QR_METHODS = ["naverpay", "kakaopay"];

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
  const [qrMethod, setQrMethod] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null); // 생성된 주문 id 추적

  const isCartEmpty = items.length === 0;
  const totalPrice = getTotalPrice();

  const handleGoToMenu = useCallback(() => {
    navigate("/menu", { replace: true });
  }, [navigate]);

  const runPayment = async (method) => {
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
      // 이미 생성된 주문(결제대기)이 있으면 재사용, 없으면 새로 생성
      let orderId = currentOrderId;
      let orderNumber;

      if (!orderId) {
        const orderResult = await withRetry(() =>
          createOrder({
            items: items.map((item) => ({
              menu_id: item.menu_id,
              quantity: item.quantity,
              option_ids: item.options.map((option) => option.option_id),
              component_menu_ids: (item.components || []).map(
                (c) => c.component_menu_id,
              ),
            })),
            order_type: orderType === "dine-in" ? "매장" : "포장",
          }),
        );

        if (orderResult.status !== "대기") {
          setFailType("order-error");
          setFailReason(orderResult.message ?? null);
          return;
        }

        orderId = orderResult.order_id;
        orderNumber = orderResult.order_number;
        setCurrentOrderId(orderId); // 재시도/취소를 위해 기억해둠
      }

      const paymentResult = await withRetry(() =>
        submitPayment({
          order_id: orderId,
          payment_method: paymentMethod,
        }),
      );

      if (paymentResult.status === "성공") {
        setOrderNumber(orderNumber ?? String(orderId));
        setTotalPrice(totalPrice);
        clearCart();
        navigate("/complete");
      } else {
        setFailType(paymentResult.fail_type ?? "declined");
        setFailReason(paymentResult.fail_reason ?? null);
      }
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
      setFailReason(null);
      setFailType(error.failType ?? "system-error");
    } finally {
      setIsPaying(false);
    }
  };

  const handlePay = (method) => {
    setIsMethodModalOpen(false);

    if (QR_METHODS.includes(method)) {
      setQrMethod(method);
      return;
    }

    runPayment(method);
  };

  const handleQrComplete = () => {
    const method = qrMethod;
    setQrMethod(null);
    runPayment(method);
  };

  const handleFailCardBack = () => {
    if (failType === "order-error") {
      navigate("/menu", { replace: true });
      return;
    }
    setFailType(null);
  };

  // 뒤로가기 = 포기 → 결제대기 상태인 주문이 있으면 취소 처리 후 이동
  const handleBack = async () => {
    if (isPaying) return; // 결제 처리 중엔 뒤로가기(취소) 불가

    if (currentOrderId) {
      const confirmed = window.confirm(
        "결제를 그만두시겠어요? 진행 중인 주문이 취소됩니다.",
      );
      if (!confirmed) return;

      try {
        await cancelOrder(currentOrderId);
      } catch (error) {
        console.error("주문 취소 실패:", error);
        // 취소 실패해도 화면 이동은 막지 않음 (사용자 경험상 뒤로가기는 항상 가능해야 함)
      }
    }

    navigate(-1);
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
        onClick={handleBack}
        disabled={isPaying}
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

      {qrMethod && (
        <EasyPayQRModal
          method={qrMethod}
          amount={totalPrice}
          onComplete={handleQrComplete}
          language={language}
        />
      )}

      {failType && (
        <PaymentFailCard
          type={failType}
          failReason={failReason}
          onRetry={() => handlePay(lastMethod)}
          onBack={handleFailCardBack}
          language={language}
        />
      )}
    </div>
  );
}

export default Payment;

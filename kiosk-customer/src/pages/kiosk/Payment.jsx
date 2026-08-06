import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ANONYMOUS, loadTossPayments } from "@tosspayments/tosspayments-sdk";
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

const QR_METHODS = ["naverpay"]; // 네이버페이만 데모 QR 유지
const TOSS_CLIENT_KEY = process.env.REACT_APP_TOSS_CLIENT_KEY;

const EASY_PAY_LABELS = {
  tosspay: "토스페이",
  kakaopay: "카카오페이",
};

function Payment() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const orderType = useOrderStore((state) => state.orderType);
  const setOrderNumber = useOrderStore((state) => state.setOrderNumber);
  const setTotalPrice = useOrderStore((state) => state.setTotalPrice);
  const pendingOrderId = useOrderStore((state) => state.pendingOrderId);
  const setPendingOrderId = useOrderStore((state) => state.setPendingOrderId);

  const language = useLanguageStore((state) => state.language);
  const t = translations[language].payment;

  const [isPaying, setIsPaying] = useState(false);
  const [failType, setFailType] = useState(null);
  const [failReason, setFailReason] = useState(null);
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [lastMethod, setLastMethod] = useState("card");
  const [qrMethod, setQrMethod] = useState(null);
  const [currentOrderNumber, setCurrentOrderNumber] = useState(null);

  const isCartEmpty = items.length === 0;
  const totalPrice = getTotalPrice();

  const handleGoToMenu = useCallback(() => {
    navigate("/menu", { replace: true });
  }, [navigate]);

  const ensureOrderCreated = async () => {
    if (pendingOrderId) {
      return { orderId: pendingOrderId, orderNumber: currentOrderNumber };
    }

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
      throw Object.assign(new Error(orderResult.message ?? "주문 생성 실패"), {
        failType: "order-error",
      });
    }

    setPendingOrderId(orderResult.order_id);
    setCurrentOrderNumber(orderResult.order_number);
    return {
      orderId: orderResult.order_id,
      orderNumber: orderResult.order_number,
    };
  };

  // 카드결제: 기존 시뮬레이션 API 그대로
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
      default:
        paymentMethod = "카드";
    }

    try {
      const { orderId, orderNumber } = await ensureOrderCreated();

      const paymentResult = await withRetry(() =>
        submitPayment({ order_id: orderId, payment_method: paymentMethod }),
      );

      if (paymentResult.status === "성공") {
        setOrderNumber(orderNumber ?? String(orderId));
        setTotalPrice(totalPrice);
        setPendingOrderId(null);
        clearCart();
        navigate("/complete");
      } else {
        setFailType(paymentResult.fail_type ?? "declined");
        setFailReason(paymentResult.fail_reason ?? null);
      }
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
      setFailReason(error.message ?? null);
      setFailType(error.failType ?? "system-error");
    } finally {
      setIsPaying(false);
    }
  };

  // 토스페이/카카오페이: 키오스크에서 바로 토스 결제창 호출 (easyPay 값만 다름)
  const runEasyPayment = async (method) => {
    setIsPaying(true);
    setFailType(null);
    setFailReason(null);
    setLastMethod(method);

    try {
      const { orderId, orderNumber } = await ensureOrderCreated();

      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: totalPrice },
        orderId: `bunshik-${orderId}-${Date.now()}`,
        orderName: "분식집 주문",
        successUrl:
          `${window.location.origin}/payment/toss/success` +
          `?kioskOrderId=${orderId}` +
          `&orderNumber=${encodeURIComponent(orderNumber ?? String(orderId))}` +
          `&totalPrice=${totalPrice}` +
          `&paymentMethod=${encodeURIComponent(EASY_PAY_LABELS[method])}`,
        failUrl: `${window.location.origin}/payment/toss/fail?kioskOrderId=${orderId}`,
        card: {
          useEscrow: false,
          flowMode: "DIRECT",
          easyPay: EASY_PAY_LABELS[method],
        },
      });
    } catch (error) {
      setIsPaying(false);

      // 손님이 결제창을 직접 닫거나 취소한 경우 — 시스템 오류가 아니라 정상적인 취소
      if (error?.code === "USER_CANCEL") {
        setFailType("user-cancel");
        setFailReason(null);
        return;
      }

      setFailType("system-error");
      setFailReason(error.message || "결제창을 열지 못했습니다.");
    }
  };

  const handlePay = (method) => {
    setIsMethodModalOpen(false);
    setLastMethod(method);

    if (QR_METHODS.includes(method)) {
      setQrMethod(method); // 네이버페이 데모 QR
      return;
    }

    if (method === "tosspay" || method === "kakaopay") {
      runEasyPayment(method);
      return;
    }

    runPayment(method); // 카드
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

  const handleBack = async () => {
    if (isPaying) return;

    if (pendingOrderId) {
      const confirmed = window.confirm(
        "결제를 그만두시겠어요? 진행 중인 주문이 취소됩니다.",
      );
      if (!confirmed) return;

      try {
        await cancelOrder(pendingOrderId);
      } catch (error) {
        console.error("주문 취소 실패:", error);
      }
      setPendingOrderId(null);
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

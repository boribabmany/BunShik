import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../../store/useOrderStore";
import checkIcon from "../../images/check.png";
import "../../styles/OrderComplete.css";

function OrderComplete() {
  const navigate = useNavigate();
  const orderNumber = useOrderStore((state) => state.orderNumber);
  const totalPrice = useOrderStore((state) => state.totalPrice);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  // 'receipt' | 'orderNumber' | null : 지금 무엇을 인쇄 중인지 표시
  const [printMode, setPrintMode] = useState(null);

  // 인쇄창이 닫히면(인쇄 완료 또는 취소) 처음 화면으로 리셋 후 이동
  useEffect(() => {
    const handleAfterPrint = () => {
      setPrintMode(null);
      resetOrder();
      navigate("/");
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, [navigate, resetOrder]);

  const handleReceiptPrint = () => {
    setPrintMode("receipt");
    // printMode가 DOM에 반영된 다음 프레임에 인쇄 실행
    requestAnimationFrame(() => window.print());
  };

  const handleOrderNumberPrint = () => {
    setPrintMode("orderNumber");
    requestAnimationFrame(() => window.print());
  };

  return (
    <div className="complete-screen">
      <div className="complete-check-circle">
        <img src={checkIcon} alt="완료" className="complete-check-icon" />
      </div>

      <h1 className="complete-title">주문이 완료되었습니다!</h1>

      <p className="complete-subtitle">
        맛있게 준비해 드릴게요.
        <br />
        잠시만 기다려주세요
      </p>

      <div className="complete-order-card">
        <p className="complete-order-label">주문번호</p>
        <p className="complete-order-number">{orderNumber}</p>
      </div>

      <p className="complete-total-label">총 결제 금액</p>
      <p className="complete-total-price">{totalPrice?.toLocaleString()}원</p>

      <button
        type="button"
        onClick={handleReceiptPrint}
        className="complete-receipt-button"
      >
        영수증 출력
      </button>

      <button
        type="button"
        onClick={handleOrderNumberPrint}
        className="complete-home-button"
      >
        주문번호만 출력
      </button>

      {/* ---------- 인쇄 전용 영역 (화면에는 안 보이고, 인쇄 시에만 표시) ---------- */}
      <div className="complete-print-area">
        {printMode === "receipt" && (
          <div className="print-receipt">
            <p className="print-receipt-heading">주문 영수증</p>
            <p className="print-receipt-label">주문번호</p>
            <p className="print-receipt-number">{orderNumber}</p>
            <p className="print-receipt-total">
              총 결제 금액 {totalPrice?.toLocaleString()}원
            </p>
          </div>
        )}

        {printMode === "orderNumber" && (
          <div className="print-ordernumber">
            <p className="print-ordernumber-label">주문번호</p>
            <p className="print-ordernumber-value">{orderNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderComplete;

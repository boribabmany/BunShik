import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../../store/useOrderStore";
import useLanguageStore from "../../store/useLanguageStore";
import { translations, formatPrice } from "../../i18n/translations";
import { requestPrintJob } from "../../api/orderApi";
import checkIcon from "../../images/check.png";
import "../../styles/OrderComplete.css";

function OrderComplete() {
  const navigate = useNavigate();
  const orderNumber = useOrderStore((state) => state.orderNumber);
  const totalPrice = useOrderStore((state) => state.totalPrice);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  const language = useLanguageStore((state) => state.language);
  const t = translations[language].orderComplete;

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async (type) => {
    if (isPrinting) return;
    setIsPrinting(true);

    try {
      await requestPrintJob(Number(orderNumber), type);
    } catch (error) {
      // 출력 요청이 실패해도 손님은 다음 화면으로 진행할 수 있어야 한다.
      // (프린터 문제는 카운터 직원이 별도로 대응)
      console.error("출력 요청 실패:", error);
    } finally {
      setIsPrinting(false);
      resetOrder();
      navigate("/");
    }
  };

  const handleReceiptPrint = () => handlePrint("RECEIPT");
  const handleOrderNumberPrint = () => handlePrint("ORDER_NUMBER");

  return (
    <div className="complete-screen">
      <div className="complete-check-circle">
        <img src={checkIcon} alt="" className="complete-check-icon" />
      </div>

      <h1 className="complete-title">{t.title}</h1>

      <p className="complete-subtitle">
        {t.subtitle1}
        <br />
        {t.subtitle2}
      </p>

      <div className="complete-order-card">
        <p className="complete-order-label">{t.orderNumberLabel}</p>
        <p className="complete-order-number">{orderNumber}</p>
      </div>

      <p className="complete-total-label">{t.totalLabel}</p>
      <p className="complete-total-price">
        {totalPrice != null ? formatPrice(language, totalPrice) : ""}
      </p>

      <button
        type="button"
        onClick={handleReceiptPrint}
        className="complete-receipt-button"
        disabled={isPrinting}
      >
        {t.printReceipt}
      </button>

      <button
        type="button"
        onClick={handleOrderNumberPrint}
        className="complete-home-button"
        disabled={isPrinting}
      >
        {t.printNumberOnly}
      </button>
    </div>
  );
}

export default OrderComplete;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../../store/useOrderStore";
import useLanguageStore from "../../store/useLanguageStore";
import { translations, formatPrice } from "../../i18n/translations";
import checkIcon from "../../images/check.png";
import "../../styles/OrderComplete.css";

function OrderComplete() {
  const navigate = useNavigate();
  const orderNumber = useOrderStore((state) => state.orderNumber);
  const totalPrice = useOrderStore((state) => state.totalPrice);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  const language = useLanguageStore((state) => state.language);
  const t = translations[language].orderComplete;

  const [printMode, setPrintMode] = useState(null);

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
    requestAnimationFrame(() => window.print());
  };

  const handleOrderNumberPrint = () => {
    setPrintMode("orderNumber");
    requestAnimationFrame(() => window.print());
  };

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
      >
        {t.printReceipt}
      </button>

      <button
        type="button"
        onClick={handleOrderNumberPrint}
        className="complete-home-button"
      >
        {t.printNumberOnly}
      </button>

      <div className="complete-print-area">
        {printMode === "receipt" && (
          <div className="print-receipt">
            <p className="print-receipt-heading">{t.title.replace("!", "")}</p>
            <p className="print-receipt-label">{t.orderNumberLabel}</p>
            <p className="print-receipt-number">{orderNumber}</p>
            <p className="print-receipt-total">
              {t.totalLabel}{" "}
              {totalPrice != null ? formatPrice(language, totalPrice) : ""}
            </p>
          </div>
        )}

        {printMode === "orderNumber" && (
          <div className="print-ordernumber">
            <p className="print-ordernumber-label">{t.orderNumberLabel}</p>
            <p className="print-ordernumber-value">{orderNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderComplete;

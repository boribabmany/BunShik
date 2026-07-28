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

  const handleReceiptPrint = () => {
    resetOrder();
    navigate("/");
  };

  const handleOrderNumberPrint = () => {
    resetOrder();
    navigate("/");
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
    </div>
  );
}

export default OrderComplete;

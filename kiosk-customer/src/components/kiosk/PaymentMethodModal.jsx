import cardIcon from "../../images/card.png";
import naverPayIcon from "../../images/naverpay.png";
import kakaoPayIcon from "../../images/payment_icon_yellow_medium.png";
import { translations } from "../../i18n/translations";
import "../../styles/PaymentMethodModal.css";

function PaymentMethodModal({ onSelect, onClose, language }) {
  const t = translations[language].paymentMethod;

  return (
    <div className="payment-method-backdrop" onClick={onClose}>
      <div
        className="payment-method-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="payment-method-title">{t.title}</p>

        <button
          type="button"
          className="payment-method-btn payment-method-naver"
          onClick={() => onSelect("naverpay")}
        >
          <img
            src={naverPayIcon}
            alt={t.naver}
            className="payment-method-full-img payment-method-naver-img"
          />
        </button>

        <button
          type="button"
          className="payment-method-btn payment-method-kakao"
          onClick={() => onSelect("kakaopay")}
        >
          <img
            src={kakaoPayIcon}
            alt={t.kakao}
            className="payment-method-full-img payment-method-kakao-img"
          />
        </button>

        <button
          type="button"
          className="payment-method-btn payment-method-card"
          onClick={() => onSelect("card")}
        >
          <img
            src={cardIcon}
            alt=""
            className="payment-method-icon payment-method-icon-card"
          />
          <span className="payment-method-label">{t.card}</span>
        </button>

        <button
          type="button"
          className="payment-method-cancel"
          onClick={onClose}
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}

export default PaymentMethodModal;

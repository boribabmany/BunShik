import { useEffect, useState } from "react";
import emptyCartIcon from "../../images/emptycart.png";
import { translations } from "../../i18n/translations";
import "../../styles/EmptyCartModal.css";

const AUTO_CLOSE_SECONDS = 5;

function EmptyCartModal({ onConfirm, language }) {
  const t = translations[language].emptyCart;
  const [remaining, setRemaining] = useState(AUTO_CLOSE_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onConfirm]);

  const progressPercent = (remaining / AUTO_CLOSE_SECONDS) * 100;

  return (
    <div className="empty-cart-backdrop">
      <div className="empty-cart-card">
        <div className="empty-cart-icon-circle">
          <img src={emptyCartIcon} alt="" className="empty-cart-icon" />
        </div>

        <p className="empty-cart-title">{t.title}</p>
        <p className="empty-cart-subtitle">{t.subtitle}</p>

        <div className="empty-cart-progress-track">
          <div
            className="empty-cart-progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="empty-cart-timer-text">{t.seconds(remaining)}</p>

        <button
          type="button"
          onClick={onConfirm}
          className="empty-cart-confirm-button"
        >
          {t.confirm}
        </button>
      </div>
    </div>
  );
}

export default EmptyCartModal;

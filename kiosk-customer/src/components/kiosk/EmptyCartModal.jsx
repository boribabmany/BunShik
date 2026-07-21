import { useEffect, useState } from "react";
import emptyCartIcon from "../../images/emptycart.png";
import "../../styles/EmptyCartModal.css";

const AUTO_CLOSE_SECONDS = 5;

function EmptyCartModal({ onConfirm }) {
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

        <p className="empty-cart-title">주문목록이 비어있습니다</p>
        <p className="empty-cart-subtitle">메뉴화면으로 이동합니다</p>

        <div className="empty-cart-progress-track">
          <div
            className="empty-cart-progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="empty-cart-timer-text">({remaining}초)</p>

        <button
          type="button"
          onClick={onConfirm}
          className="empty-cart-confirm-button"
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default EmptyCartModal;

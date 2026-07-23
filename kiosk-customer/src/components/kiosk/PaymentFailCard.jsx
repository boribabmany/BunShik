import cardErrorIcon from "../../images/credit_card_off.png";
import { translations } from "../../i18n/translations";
import "../../styles/PaymentFailCard.css";

function PaymentFailCard({ type, failReason, onRetry, onBack, language }) {
  const t = translations[language].paymentFail;
  const isCardError = type === "card-error";
  const isDeclined = type === "declined";
  const isTimeout = type === "timeout";

  const title = isCardError
    ? t.cardErrorTitle
    : isDeclined
      ? t.declinedTitle
      : isTimeout
        ? t.timeoutTitle
        : t.systemErrorTitle;

  const message = isCardError
    ? t.cardErrorMessage
    : isDeclined
      ? t.declinedMessage(failReason)
      : isTimeout
        ? t.timeoutMessage
        : t.systemErrorMessage;

  return (
    <div className="fail-card-backdrop">
      <div className="fail-card">
        <h2 className="fail-card-title">{title}</h2>

        {(isDeclined || isCardError) && (
          <img src={cardErrorIcon} alt="" className="fail-card-icon-img" />
        )}
        {(isTimeout || (!isCardError && !isDeclined)) && (
          <div className="fail-card-icon fail-card-icon-error">!</div>
        )}

        <p className="fail-card-message">{message}</p>

        <div className="fail-card-buttons">
          {isCardError ? (
            <button
              type="button"
              onClick={onBack}
              className="fail-card-btn-outline"
            >
              {t.back}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onBack}
                className="fail-card-btn-outline"
              >
                {t.backAlt}
              </button>
              <button
                type="button"
                onClick={onRetry}
                className="fail-card-btn-filled"
              >
                {t.retry}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentFailCard;

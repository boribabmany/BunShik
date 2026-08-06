import cardErrorIcon from "../../images/credit_card_off.png";
import { translations } from "../../i18n/translations";
import "../../styles/PaymentFailCard.css";

function PaymentFailCard({ type, failReason, onRetry, onBack, language }) {
  const t = translations[language].paymentFail;
  const isCardError = type === "card-error";
  const isDeclined = type === "declined";
  const isTimeout = type === "timeout";
  const isNetworkError = type === "network-error";
  const isOrderError = type === "order-error";
  const isUserCancel = type === "user-cancel"; // ← 추가

  const title = isCardError
    ? t.cardErrorTitle
    : isDeclined
      ? t.declinedTitle
      : isTimeout
        ? t.timeoutTitle
        : isNetworkError
          ? t.networkErrorTitle
          : isOrderError
            ? t.orderErrorTitle
            : isUserCancel
              ? t.userCancelTitle // ← 추가
              : t.systemErrorTitle;

  const message = isCardError
    ? t.cardErrorMessage
    : isDeclined
      ? t.declinedMessage(failReason)
      : isTimeout
        ? t.timeoutMessage
        : isNetworkError
          ? t.networkErrorMessage
          : isOrderError
            ? t.orderErrorMessage
            : isUserCancel
              ? t.userCancelMessage // ← 추가
              : t.systemErrorMessage;

  // 재시도해도 의미 없는 유형(카드 인식 불가, 주문 데이터 오류)은 버튼 1개만
  const singleButton = isCardError || isOrderError;

  return (
    <div className="fail-card-backdrop">
      <div className="fail-card">
        <h2 className="fail-card-title">{title}</h2>

        {(isDeclined || isCardError) && (
          <img src={cardErrorIcon} alt="" className="fail-card-icon-img" />
        )}
        {(isTimeout ||
          isNetworkError ||
          isOrderError ||
          isUserCancel ||
          (!isCardError && !isDeclined)) && (
          <div className="fail-card-icon fail-card-icon-error">!</div>
        )}

        <p className="fail-card-message">{message}</p>

        <div className="fail-card-buttons">
          {singleButton ? (
            <button
              type="button"
              onClick={onBack}
              className="fail-card-btn-outline"
            >
              {isOrderError ? t.backToMenu : t.back}
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

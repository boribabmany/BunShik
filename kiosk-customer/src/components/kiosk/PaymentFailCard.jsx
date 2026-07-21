import cardErrorIcon from "../../images/credit_card_off.png";
import "../../styles/PaymentFailCard.css";

function PaymentFailCard({ type, failReason, onRetry, onBack }) {
  const isCardError = type === "card-error";
  const isDeclined = type === "declined";
  const isTimeout = type === "timeout";

  const title = isCardError
    ? "결제 실패"
    : isDeclined
      ? "결제 거절"
      : isTimeout
        ? "결제 응답 지연"
        : "일시적인 오류";

  const message = isCardError
    ? "IC 카드를 인식할 수 없습니다. 카드를 다시 삽입해 주세요. 계속 인식되지 않으면 카드를 긁어(MS) 결제하거나 다른 결제수단을 이용해 주세요."
    : isDeclined
      ? failReason
        ? `카드사에서 결제를 승인하지 않았습니다 (${failReason}). 다른 카드로 시도하시거나 카드사에 문의해 주세요.`
        : "카드사에서 결제를 승인하지 않았습니다. 다른 카드로 시도하시거나 카드사에 문의해 주세요."
      : isTimeout
        ? "결제 응답이 지연되고 있습니다. 네트워크 상태를 확인하신 후 다시 시도해 주세요."
        : "결제 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주시고, 계속되면 직원을 호출해 주세요.";

  return (
    <div className="fail-card-backdrop">
      <div className="fail-card">
        <h2 className="fail-card-title">{title}</h2>

        {isDeclined && (
          <img src={cardErrorIcon} alt="" className="fail-card-icon-img" />
        )}
        {isCardError && (
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
              뒤로가기
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onBack}
                className="fail-card-btn-outline"
              >
                돌아가기
              </button>
              <button
                type="button"
                onClick={onRetry}
                className="fail-card-btn-filled"
              >
                재시도
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentFailCard;

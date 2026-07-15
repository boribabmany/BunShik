function PaymentFailCard({ type, onRetry, onBack }) {
  const isCardError = type === "card-error"; // 결제 실패 (IC카드 인식불가)
  const isDeclined = type === "declined"; // 결제 거절 (카드사 승인거절)

  const title = isCardError
    ? "결제 실패"
    : isDeclined
      ? "결제 거절"
      : "일시적인 오류";

  const message = isCardError
    ? "IC 카드를 인식할 수 없습니다. 카드를 다시 삽입해 주세요. 계속 인식되지 않으면 카드를 긁어(MS) 결제하거나 다른 결제수단을 이용해 주세요."
    : isDeclined
      ? "카드사 승인이 거절되었습니다"
      : "결제 서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";

  return (
    <div className="fail-card-backdrop">
      <div className="fail-card">
        <h2 className="fail-card-title">{title}</h2>

        {isDeclined && (
          <div className="fail-card-icon fail-card-icon-declined" />
        )}
        {isCardError && (
          <div className="fail-card-icon fail-card-icon-error">✕</div>
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

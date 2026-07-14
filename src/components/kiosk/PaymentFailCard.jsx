function PaymentFailCard({ type, onRetry, onBack }) {
  // type: 'card-error' | 'declined' | 'system-error' | 'timeout'
  const isCardError = type === "card-error";
  const isSystemError = type === "system-error";
  const isTimeout = type === "timeout";

  const title = isCardError
    ? "결제 실패"
    : isSystemError
      ? "일시적인 오류"
      : isTimeout
        ? "응답 지연"
        : "결제 거절";

  const message = isCardError
    ? "IC 카드를 인식할 수 없습니다. 카드를 다시 삽입해 주세요. 계속 인식되지 않으면 카드를 긁어(MS) 결제하거나 다른 결제수단을 이용해 주세요."
    : isSystemError
      ? "결제 서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      : isTimeout
        ? "결제 응답이 지연되고 있습니다. 카드사 상태를 확인 중이니 잠시 후 다시 시도해 주세요."
        : "카드사 승인이 거절되었습니다";

  return (
    <div>
      <h2>{title}</h2>
      <p>{message}</p>

      {isCardError ? (
        <button type="button" onClick={onBack}>
          뒤로가기
        </button>
      ) : (
        <>
          <button type="button" onClick={onBack}>
            돌아가기
          </button>
          <button type="button" onClick={onRetry}>
            재시도
          </button>
        </>
      )}
    </div>
  );
}

export default PaymentFailCard;

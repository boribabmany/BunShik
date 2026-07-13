function PaymentFailCard({ type, onRetry, onBack }) {
  // type: 'card-error' | 'declined'
  const isCardError = type === "card-error";

  return (
    <div>
      <h2>{isCardError ? "결제 실패" : "결제 거절"}</h2>

      <p>
        {isCardError
          ? "IC 카드를 인식할 수 없습니다. 카드를 다시 삽입해 주세요. 계속 인식되지 않으면 카드를 긁어(MS) 결제하거나 다른 결제수단을 이용해 주세요."
          : "카드사 승인이 거절되었습니다"}
      </p>

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

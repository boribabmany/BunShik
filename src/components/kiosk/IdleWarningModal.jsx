function IdleWarningModal({ secondsLeft, onContinue }) {
  const progressPercent = (secondsLeft / 10) * 100;

  return (
    <div className="idle-warning-backdrop">
      <div className="idle-warning-card">
        <p className="idle-warning-title">계속 이용하시겠습니까?</p>
        <p className="idle-warning-subtitle">
          잠시 후 처음 화면으로 돌아갑니다
        </p>

        <div className="idle-warning-progress-track">
          <div
            className="idle-warning-progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="idle-warning-timer-text">({secondsLeft}초)</p>

        <button
          type="button"
          onClick={onContinue}
          className="idle-warning-continue-button"
        >
          계속 이용하기
        </button>
      </div>
    </div>
  );
}

export default IdleWarningModal;

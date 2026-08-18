export default function SessionExpiryModal({ remainingSeconds, onContinue, onLogout }) {
  return (
    <div className="session-modal-backdrop" role="presentation">
      <section
        className="session-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="session-modal-title"
        aria-describedby="session-modal-description"
      >
        <h2 id="session-modal-title">자동 로그아웃 안내</h2>
        <p id="session-modal-description">
          장시간 사용하지 않아 {remainingSeconds}초 후 자동 로그아웃됩니다.
        </p>
        <p className="session-modal-help">계속 사용하시겠습니까?</p>
        <div className="session-modal-actions">
          <button type="button" className="session-logout-btn" onClick={onLogout}>
            로그아웃
          </button>
          <button type="button" className="session-continue-btn" onClick={onContinue} autoFocus>
            계속 사용
          </button>
        </div>
      </section>
    </div>
  );
}

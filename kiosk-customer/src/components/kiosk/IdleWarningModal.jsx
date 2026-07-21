import { translations } from "../../i18n/translations";
import "../../styles/IdleWarningModal.css";

function IdleWarningModal({ secondsLeft, onContinue, language }) {
  const t = translations[language].idleWarning;
  const progressPercent = (secondsLeft / 10) * 100;

  return (
    <div className="idle-warning-backdrop">
      <div className="idle-warning-card">
        <p className="idle-warning-title">{t.title}</p>
        <p className="idle-warning-subtitle">{t.subtitle}</p>

        <div className="idle-warning-progress-track">
          <div
            className="idle-warning-progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="idle-warning-timer-text">{t.seconds(secondsLeft)}</p>

        <button
          type="button"
          onClick={onContinue}
          className="idle-warning-continue-button"
        >
          {t.continue}
        </button>
      </div>
    </div>
  );
}

export default IdleWarningModal;

import { translations } from "../../i18n/translations";
import "../../styles/PrintingModal.css";

function PrintingModal({ type, language }) {
  const t = translations[language].orderComplete;
  const message = type === "RECEIPT" ? t.printingReceipt : t.printingNumber;

  return (
    <div className="printing-backdrop" role="status" aria-live="polite">
      <div className="printing-card">
        <div className="printing-dots">
          <span className="printing-dot" />
          <span className="printing-dot" />
          <span className="printing-dot" />
        </div>
        <p className="printing-message">{message}</p>
      </div>
    </div>
  );
}

export default PrintingModal;

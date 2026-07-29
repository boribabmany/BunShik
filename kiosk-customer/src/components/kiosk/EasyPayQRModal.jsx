import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { translations } from "../../i18n/translations";
import "../../styles/EasyPayQRModal.css";

const QR_WAIT_SECONDS = 5; // QR 노출 후 자동으로 결제 진행까지의 대기 시간

function EasyPayQRModal({ method, amount, onComplete, language }) {
  const t = translations[language].paymentMethod;
  const [seconds, setSeconds] = useState(QR_WAIT_SECONDS);

  const methodLabel = method === "naverpay" ? t.naver : t.kakao;
  const brandColor = method === "naverpay" ? "#03c75a" : "#fee500";

  // 데모용 QR 값 — 실제 결제 URL이 아니라 화면 확인용
  const qrValue = `bunshik-kiosk-demo://${method}?amount=${amount}`;

  useEffect(() => {
    if (seconds <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, onComplete]);

  return (
    <div className="easypay-qr-backdrop">
      <div className="easypay-qr-card">
        <p className="easypay-qr-brand" style={{ color: brandColor }}>
          {methodLabel}
        </p>
        <h2 className="easypay-qr-title">
          휴대폰으로 QR을
          <br />
          스캔해 주세요
        </h2>

        <div className="easypay-qr-shell">
          <QRCodeSVG value={qrValue} size={240} level="H" />
        </div>

        <p className="easypay-qr-amount">{amount.toLocaleString("ko-KR")}원</p>
        <p className="easypay-qr-timer">{seconds}초 후 자동으로 진행됩니다</p>
      </div>
    </div>
  );
}

export default EasyPayQRModal;

import { useEffect, useState } from "react";

const AUTO_CLOSE_SECONDS = 5;

function EmptyCartModal({ onConfirm }) {
  const [remaining, setRemaining] = useState(AUTO_CLOSE_SECONDS);

  useEffect(() => {
    // 1초마다 남은 시간을 줄이고, 0이 되면 자동으로 이동
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onConfirm]);

  // 진행 바 채워지는 비율 (초록 부분이 줄어드는 방향)
  const progressPercent = (remaining / AUTO_CLOSE_SECONDS) * 100;

  return (
    <div>
      <div>
        <div>
          {/* 장바구니 아이콘 자리 (아이콘 라이브러리 또는 이미지로 교체 예정) */}
          <span>🛒</span>
        </div>

        <p>주문목록이 비어있습니다</p>
        <p>메뉴화면으로 이동합니다</p>

        <div>
          <div style={{ width: `${progressPercent}%` }} />
        </div>
        <span>({remaining}초)</span>

        <button type="button" onClick={onConfirm}>
          확인
        </button>
      </div>
    </div>
  );
}

export default EmptyCartModal;

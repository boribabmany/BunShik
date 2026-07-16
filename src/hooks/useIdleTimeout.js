import { useEffect, useRef } from "react";

// 사용자가 지정한 시간(ms) 동안 아무 조작(마우스/터치/키보드)이 없으면 onIdle 콜백 실행
const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "touchstart",
  "touchmove",
  "keydown",
  "scroll",
  "click",
];

function useIdleTimeout({ timeout, onIdle, isActive = true }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isActive) return undefined;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onIdle, timeout);
    };

    // 최초 진입 시에도 타이머 시작
    resetTimer();

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, resetTimer),
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, resetTimer),
      );
    };
  }, [timeout, onIdle, isActive]);
}

export default useIdleTimeout;

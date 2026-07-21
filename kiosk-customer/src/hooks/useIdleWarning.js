import { useEffect, useRef, useCallback, useState } from "react";

const IDLE_TIMEOUT_MS = 90 * 1000; // 마지막 조작 후 90초
const WARNING_MS = 10 * 1000; // 90초 중 마지막 10초는 경고 모달을 띄움

const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "touchstart",
  "touchmove",
  "keydown",
  "scroll",
  "click",
];

// 90초 유휴 감지 + 마지막 10초 카운트다운 경고를 함께 관리하는 훅
function useIdleWarning({ onIdle, isActive = true }) {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARNING_MS / 1000);

  const warningTimerRef = useRef(null);
  const finalTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const clearAllTimers = () => {
    clearTimeout(warningTimerRef.current);
    clearTimeout(finalTimerRef.current);
    clearInterval(countdownIntervalRef.current);
  };

  // 타이머를 처음부터 다시 시작 (활동이 감지될 때마다 호출됨)
  const restartTimers = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    setSecondsLeft(WARNING_MS / 1000);

    // 80초 시점에 경고 모달 표시 + 카운트다운 시작
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      let remaining = WARNING_MS / 1000;

      countdownIntervalRef.current = setInterval(() => {
        remaining -= 1;
        setSecondsLeft(remaining);
        if (remaining <= 0) {
          clearInterval(countdownIntervalRef.current);
        }
      }, 1000);
    }, IDLE_TIMEOUT_MS - WARNING_MS);

    // 90초 시점에 실제 초기화 실행
    finalTimerRef.current = setTimeout(() => {
      setShowWarning(false);
      onIdle();
    }, IDLE_TIMEOUT_MS);
  }, [onIdle]);

  useEffect(() => {
    if (!isActive) {
      clearAllTimers();
      setShowWarning(false);
      return undefined;
    }

    restartTimers();

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, restartTimers),
    );

    return () => {
      clearAllTimers();
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, restartTimers),
      );
    };
  }, [isActive, restartTimers]);

  // 경고 모달의 "계속 이용하기" 버튼에서 명시적으로 호출
  const continueSession = () => {
    restartTimers();
  };

  return { showWarning, secondsLeft, continueSession };
}

export default useIdleWarning;

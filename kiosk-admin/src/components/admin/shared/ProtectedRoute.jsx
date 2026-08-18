import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import NewOrderToast from "./NewOrderToast";
import SessionExpiryModal from "./SessionExpiryModal";
import "../../../styles/AdminSession.css";

const IDLE_LIMIT_MS = 60 * 60 * 1000;
const WARNING_BEFORE_MS = 60 * 1000;

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";
  const accessToken = sessionStorage.getItem("accessToken");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(WARNING_BEFORE_MS / 1000);
  const warningOpenRef = useRef(false);
  const warningTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);

  const logout = useCallback(() => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("isAdminLoggedIn");
    navigate("/adminlogin", { replace: true });
  }, [navigate]);

  const startIdleTimers = useCallback(() => {
    clearTimeout(warningTimerRef.current);
    clearTimeout(logoutTimerRef.current);
    warningOpenRef.current = false;
    setIsWarningOpen(false);
    setRemainingSeconds(WARNING_BEFORE_MS / 1000);

    warningTimerRef.current = setTimeout(() => {
      warningOpenRef.current = true;
      setIsWarningOpen(true);
    }, IDLE_LIMIT_MS - WARNING_BEFORE_MS);
    logoutTimerRef.current = setTimeout(logout, IDLE_LIMIT_MS);
  }, [logout]);

  useEffect(() => {
    if (!isLoggedIn || !accessToken) return undefined;
    startIdleTimers();

    const handleActivity = () => {
      if (!warningOpenRef.current) startIdleTimers();
    };
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, handleActivity));

    return () => {
      clearTimeout(warningTimerRef.current);
      clearTimeout(logoutTimerRef.current);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, handleActivity));
    };
  }, [accessToken, isLoggedIn, startIdleTimers]);

  useEffect(() => {
    if (!isWarningOpen) return undefined;
    const intervalId = setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isWarningOpen]);

  if (!isLoggedIn || !accessToken) {
    return <Navigate to="/adminlogin" replace />;
  }

  return (
    <>
      <NewOrderToast />
      <Outlet />
      {isWarningOpen && (
        <SessionExpiryModal
          remainingSeconds={remainingSeconds}
          onContinue={startIdleTimers}
          onLogout={logout}
        />
      )}
    </>
  );
}

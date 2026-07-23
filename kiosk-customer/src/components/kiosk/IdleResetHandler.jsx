import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useIdleWarning from "../../hooks/useIdleWarning";
import useCartStore from "../../store/useCartStore";
import useOrderStore from "../../store/useOrderStore";
import useLanguageStore from "../../store/useLanguageStore";
import IdleWarningModal from "./IdleWarningModal";

function IdleResetHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const clearCart = useCartStore((state) => state.clearCart);
  const resetOrder = useOrderStore((state) => state.resetOrder);
  const language = useLanguageStore((state) => state.language);

  const isHome = location.pathname === "/";

  const handleIdle = useCallback(() => {
    clearCart();
    resetOrder();
    navigate("/", { replace: true });
  }, [clearCart, resetOrder, navigate]);

  const { showWarning, secondsLeft, continueSession } = useIdleWarning({
    onIdle: handleIdle,
    isActive: !isHome,
  });

  if (!showWarning) return null;

  return (
    <IdleWarningModal
      secondsLeft={secondsLeft}
      onContinue={continueSession}
      language={language}
    />
  );
}

export default IdleResetHandler;

import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useIdleTimeout from "../../hooks/useIdleTimeout";
import useCartStore from "../../store/useCartStore";
import useOrderStore from "../../store/useOrderStore";

const IDLE_TIMEOUT_MS = 90 * 1000; // 90초

function IdleResetHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const clearCart = useCartStore((state) => state.clearCart);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  const isHome = location.pathname === "/";

  const handleIdle = useCallback(() => {
    clearCart();
    resetOrder();
    navigate("/", { replace: true });
  }, [clearCart, resetOrder, navigate]);

  // 이미 Home 화면이면 리셋할 필요 없으니 타이머 자체를 안 돌림
  useIdleTimeout({
    timeout: IDLE_TIMEOUT_MS,
    onIdle: handleIdle,
    isActive: !isHome,
  });

  return null; // 화면에 아무것도 그리지 않는 로직 전용 컴포넌트
}

export default IdleResetHandler;

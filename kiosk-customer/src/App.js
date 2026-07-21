import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/kiosk/Home";
import Menu from "./pages/kiosk/Menu";
import Cart from "./pages/kiosk/Cart";
import Payment from "./pages/kiosk/Payment";
import OrderComplete from "./pages/kiosk/OrderComplete";
import IdleResetHandler from "./components/kiosk/IdleResetHandler";

function App() {
  const [kioskScale, setKioskScale] = useState(1);

  useEffect(() => {
    const updateKioskScale = () => {
      const viewport = window.visualViewport;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const viewportHeight = viewport?.height ?? window.innerHeight;

      // Keep the full 1080 x 1920 kiosk canvas visible on every screen ratio.
      setKioskScale(Math.min(viewportWidth / 1080, viewportHeight / 1920));
    };

    updateKioskScale();
    window.addEventListener("resize", updateKioskScale);
    window.addEventListener("orientationchange", updateKioskScale);
    window.visualViewport?.addEventListener("resize", updateKioskScale);

    return () => {
      window.removeEventListener("resize", updateKioskScale);
      window.removeEventListener("orientationchange", updateKioskScale);
      window.visualViewport?.removeEventListener("resize", updateKioskScale);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="kiosk-screen">
        <div className="kiosk-viewport" style={{ "--kiosk-scale": kioskScale }}>
          <IdleResetHandler />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/complete" element={<OrderComplete />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

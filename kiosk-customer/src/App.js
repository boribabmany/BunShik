import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/kiosk/Home";
import Menu from "./pages/kiosk/Menu";
import Cart from "./pages/kiosk/Cart";
import Payment from "./pages/kiosk/Payment";
import OrderComplete from "./pages/kiosk/OrderComplete";
import IdleResetHandler from "./components/kiosk/IdleResetHandler";

function App() {
  return (
    <BrowserRouter>
      <IdleResetHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/complete" element={<OrderComplete />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

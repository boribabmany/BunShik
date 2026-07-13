import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/kiosk/Home";
import Menu from "./pages/kiosk/Menu";
import Cart from "./pages/kiosk/Cart";
import Payment from "./pages/kiosk/Payment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/kiosk/Home";
import Menu from "./pages/kiosk/Menu";
import Cart from "./pages/kiosk/Cart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

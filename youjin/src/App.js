import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/kiosk/Home";
import Menu from "./pages/kiosk/Menu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminOrder from "./pages/admin/AdminOrder";
import AdminMenuEdit from "./pages/admin/AdminMenuEdit";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminSalesDashboard from "./pages/admin/AdminSalesDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/adminlogin" replace />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/adminmenu" element={<AdminMenu />} />
          <Route path="/adminsales" element={<AdminSalesDashboard />} />
          <Route path="/adminorder" element={<AdminOrder />} />
          <Route path="/adminmenuedit" element={<AdminMenuEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
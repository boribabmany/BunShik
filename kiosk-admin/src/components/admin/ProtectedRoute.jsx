import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // 세션 스토리지에서 로그인 상태를 꺼내옴
  const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";
  // 로그인이 되어 있으면 하위 페이지(<Outlet />)를 보여주고, 
  // 안 되어 있으면 무조건 로그인 페이지로 쫓아냄(<Navigate />)
  return isLoggedIn ? <Outlet /> : <Navigate to="/adminlogin" replace />;
}
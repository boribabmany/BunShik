import { Navigate, Outlet } from "react-router-dom";
import NewOrderToast from "./NewOrderToast";

export default function ProtectedRoute() {
  const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";

  const accessToken = sessionStorage.getItem("accessToken");

  if (!isLoggedIn || !accessToken) {
    return <Navigate to="/adminlogin" replace />;
  }

  return (
    <>
      <NewOrderToast />
      <Outlet />
    </>
  );
}

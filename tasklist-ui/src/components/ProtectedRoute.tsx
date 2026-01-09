import { Navigate, Outlet } from "react-router-dom";
import { tokenService } from "../services/tokenServices";


export default function ProtectedRoute() {
  const token = tokenService.getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

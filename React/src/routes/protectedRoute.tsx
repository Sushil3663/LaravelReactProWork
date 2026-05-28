import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/store/hooks";

interface ProtectedRouteType {
  isAuthenticated?: boolean | object;
}
const ProtectedRoute = ({ isAuthenticated }: ProtectedRouteType) => {
  const token = useAppSelector((s) => s.auth.token);
  const hasAccess = isAuthenticated ?? !!token;
  return <>{hasAccess ? <Outlet /> : <Navigate to="/login" replace />}</>;
};

export default ProtectedRoute;

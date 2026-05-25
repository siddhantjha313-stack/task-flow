import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="noise grid min-h-screen place-items-center">
        <div className="glass flex items-center gap-3 rounded-lg px-5 py-4 text-sm font-semibold">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-200" />
          Warming up your workspace
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

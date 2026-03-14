import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useEffect } from "react";


interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error("Please sign in to access this page.");
      } else if (requiredRole && userRole !== requiredRole) {
        toast.error(`Access denied. ${requiredRole} credentials required.`);
      }
    }
  }, [user, userRole, loading, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-navy-hero">
        <div className="animate-pulse text-primary-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

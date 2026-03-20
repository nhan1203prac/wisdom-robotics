import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../../service/api/auth.api"; // điều chỉnh đường dẫn nếu cần

type User = {
  id: number;
  email: string;
  role: "ADMIN" | "EMPLOYEE" | "USER";
};

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user in ProtectedRoute:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in → go to login
  if (!token) return <Navigate to="/login" replace />;

  // Wrong role → redirect to their correct home
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "recruiter") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
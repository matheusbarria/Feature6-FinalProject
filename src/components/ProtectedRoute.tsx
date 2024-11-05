// components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

/**
 * ProtectedRoute Component
 *
 * Handles authentication protection for routes that require user login.
 * Requirements met:
 * - Prevents access to protected routes without authentication
 * - Redirects to auth component if unauthenticated
 * - Handles manual URL entry protection
 *
 * @param {React.ReactElement} children - The child component to render if authenticated
 * @returns {React.ReactElement} The protected component or redirect
 */
interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated, saving the attempted URL
  if (!isAuthenticated) {
    console.log("Unauthorized access attempt to:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

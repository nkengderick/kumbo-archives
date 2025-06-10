// components/ProtectedRoute.js - Route Protection Component
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
  </div>
);

// Protected Route Component
export const ProtectedRoute = ({
  children,
  roles = [],
  permissions = [],
  fallback = null,
}) => {
  const { isAuthenticated, isLoading, canAccess } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check role/permission access
  if (!canAccess(roles, permissions)) {
    // Return fallback component or redirect to unauthorized page
    if (fallback) {
      return fallback;
    }

    return (
      <Navigate
        to="/unauthorized"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Render children if authenticated and authorized
  return children;
};

// Public Route Component (redirect to dashboard if authenticated)
export const PublicRoute = ({ children, redirectTo = "/dashboard" }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render children if not authenticated
  return children;
};

// Admin Only Route
export const AdminRoute = ({ children, fallback = null }) => {
  return (
    <ProtectedRoute roles={["admin"]} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
};

// Staff or Admin Route
export const StaffRoute = ({ children, fallback = null }) => {
  return (
    <ProtectedRoute roles={["admin", "staff"]} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
};

// Role-based Route Component
export const RoleRoute = ({ children, allowedRoles = [], fallback = null }) => {
  return (
    <ProtectedRoute roles={allowedRoles} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
};

// Permission-based Route Component
export const PermissionRoute = ({
  children,
  requiredPermissions = [],
  fallback = null,
}) => {
  return (
    <ProtectedRoute permissions={requiredPermissions} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
};

// Unauthorized Page Component
export const UnauthorizedPage = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.084 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>

        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>

        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <p className="text-sm text-gray-500">
            <strong>Your Role:</strong> {user?.role || "Unknown"}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Requested Page:</strong> {location.state?.from || "Unknown"}
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

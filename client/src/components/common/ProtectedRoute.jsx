import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Route guard component that restricts access to authenticated users
 * and redirects to the appropriate role-based dashboard if a user tries
 * to access unauthorized paths.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex flex-col items-center justify-center space-y-4 font-sans">
        <Loader2 className="w-10 h-10 text-[#F97316] animate-spin" />
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#64748B]">
          Authenticating Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location they tried to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to their home dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'technician') {
      return <Navigate to="/technician/dashboard" replace />;
    } else {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  return children;
}

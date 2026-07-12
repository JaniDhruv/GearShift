import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * GuestLayout — Prevents authenticated users from accessing guest-only pages (e.g. /login, /register).
 * Redirects to /dashboard if already logged in.
 */
export default function GuestLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/inventory';

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedLayout() {
  // Architectural foundation for authentication guard
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <Outlet />
    </div>
  );
}

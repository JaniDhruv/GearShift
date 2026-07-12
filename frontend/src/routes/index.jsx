import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import GuestLayout from '../layouts/GuestLayout';
import ProtectedLayout from '../layouts/ProtectedLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Workspace from '../pages/Workspace';
import Admin from '../pages/Admin';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public home */}
        <Route index element={<Home />} />

        {/* Public or Protected Inventory route */}
        <Route path="inventory" element={<Dashboard />} />
        <Route path="dashboard" element={<Navigate to="/inventory" replace />} />

        {/* Guest-only routes: redirect authenticated users to /inventory */}
        <Route element={<GuestLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected routes: require authentication */}
        <Route element={<ProtectedLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Operational workspace route: staff and admin */}
        <Route element={<ProtectedLayout allowedRoles={['staff', 'admin']} />}>
          <Route path="workspace" element={<Workspace />} />
        </Route>

        {/* Admin-only protected route */}
        <Route element={<ProtectedLayout allowedRoles={['admin']} />}>
          <Route path="admin" element={<Admin />} />
        </Route>
      </Route>
    </Routes>
  );
}

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Car, LayoutDashboard, Shield, LogIn, UserPlus, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const isStaffOrAdmin = user?.role === 'staff' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
        : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Gear<span className="text-emerald-400">Shift</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/inventory" className={navLinkClass}>
              <Car className="w-4 h-4" />
              Inventory
            </NavLink>
            {isStaffOrAdmin && (
              <NavLink to="/workspace" className={navLinkClass}>
                <Briefcase className="w-4 h-4" />
                Workspace
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                <Shield className="w-4 h-4" />
                Administration
              </NavLink>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.name && (
                  <div className="flex items-center gap-2 hidden sm:flex">
                    <span className="text-sm font-medium text-white">
                      👤 {user.name}
                    </span>
                    <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gray-800 text-emerald-400 border border-gray-700">
                      {user.role}
                    </span>
                  </div>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-gray-950 shadow-md shadow-emerald-500/20 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

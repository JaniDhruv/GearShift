import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const isStaffOrAdmin = user?.role === 'staff' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-150 px-1 py-1 ${
      isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900'
    }`;

  const activeIndicator = (isActive) =>
    isActive
      ? 'after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-primary-500 after:rounded-full'
      : '';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500 text-white shadow-sm group-hover:bg-primary-600 transition-colors">
              <i className="bx bxs-car text-[17px]" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-ink-900">
              Gear<span className="text-primary-500">Shift</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/" end className={({ isActive }) => `${navLinkClass({ isActive })} ${activeIndicator(isActive)}`}>
              Home
            </NavLink>
            <NavLink to="/inventory" className={({ isActive }) => `${navLinkClass({ isActive })} ${activeIndicator(isActive)}`}>
              Inventory
            </NavLink>
            {isStaffOrAdmin && (
              <NavLink to="/workspace" className={({ isActive }) => `${navLinkClass({ isActive })} ${activeIndicator(isActive)}`}>
                <span className="flex items-center gap-1.5">
                  <i className="bx bxs-briefcase text-sm" />
                  Workspace
                </span>
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `${navLinkClass({ isActive })} ${activeIndicator(isActive)}`}>
                <span className="flex items-center gap-1.5">
                  <i className="bx bxs-shield text-sm" />
                  Administration
                </span>
              </NavLink>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.name && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream-100 border border-cream-200">
                    <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-white text-[10px] font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-ink-800">{user.name}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${
                      user.role === 'admin' ? 'bg-violet-100 text-violet-700'
                      : user.role === 'staff' ? 'bg-primary-50 text-primary-700'
                      : 'bg-cream-200 text-ink-600'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-ink-500 hover:text-ink-900 hover:bg-cream-100 transition-colors"
                >
                  <i className="bx bx-log-out text-base" />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-ink-600 hover:text-ink-900 hover:bg-cream-100 transition-colors">
                  <i className="bx bx-log-in text-base" />
                  Sign In
                </Link>
                <Link to="/register" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white shadow-sm shadow-primary-500/20 transition-all">
                  <i className="bx bx-user-plus text-base" />
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

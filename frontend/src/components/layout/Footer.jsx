import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-cream-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary-500 text-white">
                <i className="bx bxs-car text-sm" />
              </div>
              <span className="text-base font-bold text-ink-900">
                Gear<span className="text-primary-500">Shift</span>
              </span>
            </div>
            <p className="text-xs text-ink-400 leading-relaxed max-w-[200px]">
              India's premier digital dealership with verified inventory and transparent ex-showroom pricing.
            </p>
          </div>

          {/* Showroom */}
          <div>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-ink-400 mb-3">Showroom</p>
            <ul className="space-y-2">
              <li>
                <Link to="/inventory" className="text-sm text-ink-500 hover:text-ink-900 transition-colors">
                  Browse Inventory
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-ink-500 hover:text-ink-900 transition-colors">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-ink-400 mb-3">Company</p>
            <ul className="space-y-2">
              <li><span className="text-sm text-ink-500 hover:text-ink-900 transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-sm text-ink-500 hover:text-ink-900 transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="text-sm text-ink-500 hover:text-ink-900 transition-colors cursor-pointer">Contact Support</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-ink-400">
            © {new Date().getFullYear()} GearShift Automotive Systems. All rights reserved.
          </span>
          <span className="text-xs text-ink-400">Built for India's modern dealership network.</span>
        </div>
      </div>
    </footer>
  );
}

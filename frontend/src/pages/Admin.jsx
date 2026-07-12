import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '../services/vehicleService';

export default function Admin() {
  const { user } = useAuth();

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
    staleTime: 60 * 1000,
  });

  const outOfStock = vehicles.filter((v) => v.quantity === 0);
  const lowStock   = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3);
  const alertVehicles = [...outOfStock, ...lowStock];

  return (
    <div className="flex-1 flex flex-col bg-cream-100 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
        <div className="anim-blob-1 absolute -top-20 right-0 w-96 h-96 bg-violet-500/7 blur-3xl rounded-full" />
        <div className="anim-blob-2 absolute bottom-10 -left-20 w-80 h-80 bg-primary-500/6 blur-3xl rounded-full" />
        <div className="anim-blob-4 absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full" />
      </div>

      {/* Sticky Header */}
      <div className="border-b border-cream-200 bg-white/95 backdrop-blur-sm sticky top-[60px] z-30 shadow-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 text-violet-600">
                <i className="bx bxs-shield text-xl" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest font-semibold text-violet-600">Admin Portal</p>
                <h1 className="text-xl font-bold text-ink-900">Command Center</h1>
                <p className="text-sm text-ink-500">System Health, Role Diagnostics &amp; Dealership Alerts</p>
              </div>
            </div>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-all shadow-sm shadow-primary-500/20"
            >
              <i className="bx bxs-briefcase text-base" />
              Open Operational Workspace
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN (2/3) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Requires Attention */}
            <div className="bg-white border border-cream-200 rounded-2xl shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-cream-100">
                <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
                  <i className="bx bxs-error text-lg text-amber-500" />
                  Requires Attention
                  {alertVehicles.length > 0 && (
                    <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600">
                      {alertVehicles.length}
                    </span>
                  )}
                </h2>
                <Link to="/workspace" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
                  Resolve in Workspace <i className="bx bx-right-arrow-alt text-base" />
                </Link>
              </div>

              {alertVehicles.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <i className="bx bxs-check-circle text-4xl text-primary-400 block mb-2 anim-float" />
                  <p className="text-sm text-ink-400">All inventory units have healthy stock counts.</p>
                </div>
              ) : (
                <div className="divide-y divide-cream-100">
                  {alertVehicles.map((v) => (
                    <div key={v.id} className="flex items-center justify-between px-6 py-3.5 gap-3 hover:bg-cream-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-1 h-8 rounded-full shrink-0 ${v.quantity === 0 ? 'bg-red-400' : 'bg-amber-400'}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink-900 truncate">{v.make} {v.model}</p>
                          <p className="text-xs text-ink-400">{v.category} · ₹{v.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                          v.quantity === 0
                            ? 'text-red-600 bg-red-50 border-red-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}>
                          {v.quantity === 0 ? 'Out of stock' : `Low — ${v.quantity} left`}
                        </span>
                        <Link to="/workspace" className="px-3 py-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-xs font-medium text-ink-700 border border-cream-200 transition-all">
                          Restock
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Role Metrics */}
            <div className="bg-white border border-cream-200 rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-cream-100">
                <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
                  <i className="bx bxs-group text-lg text-violet-500" />
                  Dealership Role Metrics
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-cream-100">
                {[
                  { label: 'Platform Administrators', value: '1', sub: 'Executive Access', icon: 'bxs-shield', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
                  { label: 'Dealership Staff', value: '1', sub: 'Operational Workspace', icon: 'bxs-briefcase', color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100' },
                  { label: 'Registered Customers', value: 'Active', sub: 'Showroom Purchasing', icon: 'bxs-user-check', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                ].map(({ label, value, sub, icon, color, bg, border }) => (
                  <div key={label} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-ink-400 font-medium">{label}</p>
                      <p className="text-2xl font-bold text-ink-900 mt-1">{value}</p>
                      <p className={`text-xs font-semibold mt-1 ${color}`}>{sub}</p>
                    </div>
                    <div className={`p-2.5 rounded-xl ${bg} border ${border}`}>
                      <i className={`bx ${icon} text-2xl ${color}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (1/3) ── */}
          <div className="space-y-6">

            {/* System Health */}
            <div className="bg-white border border-cream-200 rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-cream-100">
                <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
                  <i className="bx bx-pulse text-lg text-primary-500" />
                  Platform System Health
                </h2>
              </div>
              <div className="divide-y divide-cream-100">
                {[
                  { icon: 'bxs-data',         color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100', label: 'Database Connected', value: 'MongoDB Localhost' },
                  { icon: 'bx-pulse',          color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100',    label: 'API Core Server',     value: 'Online (Port 5000)' },
                  { icon: 'bxs-shield-alt-2',  color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100',  label: 'JWT Authorization',   value: 'Active & Secured' },
                ].map(({ icon, color, bg, border, label, value }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${bg} ${border}`}>
                        <i className={`bx ${icon} text-base ${color}`} />
                      </div>
                      <div>
                        <p className="text-xs text-ink-400 font-medium">{label}</p>
                        <p className="text-sm font-semibold text-ink-900">{value}</p>
                      </div>
                    </div>
                    <i className="bx bxs-check-circle text-xl text-primary-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Snapshot */}
            <div className="bg-white border border-cream-200 rounded-2xl shadow-card p-5">
              <h2 className="text-sm font-bold text-ink-900 mb-4 flex items-center gap-2">
                <i className="bx bxs-car text-base text-blue-500" />
                Inventory Snapshot
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Total Catalog Listings',   value: vehicles.length,                               bar: 'bg-blue-400' },
                  { label: 'In-Stock Listings',         value: vehicles.filter((v) => v.quantity > 0).length, bar: 'bg-primary-500' },
                  { label: 'Out of Stock',              value: outOfStock.length,                             bar: 'bg-red-400' },
                  { label: 'Low Stock Alerts',          value: lowStock.length,                               bar: 'bg-amber-400' },
                ].map(({ label, value, bar }) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${bar} shrink-0`} />
                      <span className="text-xs text-ink-500 truncate">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-ink-900 shrink-0">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

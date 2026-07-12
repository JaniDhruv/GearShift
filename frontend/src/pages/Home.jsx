import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getVehicles } from '../services/vehicleService';

const CATEGORY_GRADIENTS = {

  SEDAN:'from-blue-50 to-blue-100', SUV:'from-violet-50 to-violet-100',
  HATCHBACK:'from-amber-50 to-amber-100', TRUCK:'from-orange-50 to-orange-100',
  SPORTS:'from-red-50 to-red-100', LUXURY:'from-emerald-50 to-emerald-100',
  ELECTRIC:'from-cyan-50 to-cyan-100', HYBRID:'from-teal-50 to-teal-100',
};
const CATEGORY_BXICON = {
  SEDAN:'bxs-car', SUV:'bxs-car', HATCHBACK:'bxs-car', TRUCK:'bxs-truck',
  SPORTS:'bx-car', LUXURY:'bxs-diamond', ELECTRIC:'bxs-bolt-circle', HYBRID:'bxs-leaf',
};
const CATEGORY_ICON_COLOR = {
  SEDAN:'text-blue-400', SUV:'text-violet-400', HATCHBACK:'text-amber-400',
  TRUCK:'text-orange-400', SPORTS:'text-red-400', LUXURY:'text-emerald-400',
  ELECTRIC:'text-cyan-400', HYBRID:'text-teal-400',
};

export default function Home() {
  const { user } = useAuth();

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles', 'all'],
    queryFn: () => import('../services/vehicleService').then(m => m.getVehicles()),
    staleTime: 30 * 1000,
  });

  const totalListings    = vehicles.length;
  const lowStockVehicles = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3);
  const outOfStockCount  = vehicles.filter((v) => v.quantity === 0).length;
  const totalValue       = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
  const featuredVehicles = vehicles.slice(0, 3);

  // ─── STAFF HOME ─────────────────────────────────────────────────────────────
  if (user?.role === 'staff') {
    return (
      <div className="flex-1 relative overflow-hidden bg-cream-100 py-8 px-4 sm:px-6 lg:px-8">
        {/* Animated blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="anim-blob-1 absolute -top-24 -left-24 w-80 h-80 bg-primary-500/8 blur-3xl rounded-full" />
          <div className="anim-blob-2 absolute top-1/2 right-0 w-64 h-64 bg-blue-500/6 blur-3xl rounded-full" />
          <div className="anim-blob-3 absolute bottom-0 left-1/3 w-72 h-72 bg-teal-500/5 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white border border-cream-200 rounded-2xl shadow-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 anim-fade-up">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-primary-600">
                Staff Operations Hub
              </span>
              <h1 className="text-2xl font-bold text-ink-900 mt-1">Good day, {user.name}</h1>
              <p className="text-sm text-ink-500 mt-0.5">Here is today's inventory operational overview.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/inventory" className="px-4 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-ink-700 text-sm font-medium border border-cream-200 transition-all">
                Browse Inventory
              </Link>
              <Link to="/workspace" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm shadow-sm shadow-primary-500/20 transition-all">
                <i className="bx bxs-briefcase text-base" />
                Open Workspace
              </Link>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Active Listings', value: totalListings, color: 'bg-primary-500' },
              { label: 'In-Stock Units', value: vehicles.reduce((acc, v) => acc + v.quantity, 0), color: 'bg-primary-500' },
              { label: 'Low Stock Alerts', value: lowStockVehicles.length, color: 'bg-amber-400' },
              { label: 'Total Inventory Value', value: `₹${totalValue.toLocaleString('en-IN')}`, color: 'bg-violet-500', small: true },
            ].map(({ label, value, color, small }) => (
              <div key={label} className="gs-stat-card">
                <div className={`absolute top-0 inset-x-0 h-[3px] ${color} rounded-t-2xl`} />
                <p className="text-xs text-ink-500 font-medium pt-1">{label}</p>
                <p className={`font-bold text-ink-900 mt-1.5 ${small ? 'text-lg' : 'text-2xl'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Low Stock Table */}
          <div className="bg-white border border-cream-200 rounded-2xl shadow-card p-6">
            <h2 className="text-base font-bold text-ink-900 mb-4 flex items-center gap-2">
              <i className="bx bxs-error text-lg text-amber-500" />
              Units Requiring Attention
              {lowStockVehicles.length > 0 && (
                <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                  {lowStockVehicles.length}
                </span>
              )}
            </h2>
            {lowStockVehicles.length === 0 ? (
              <p className="text-sm text-ink-400">All vehicles have healthy stock levels. ✓</p>
            ) : (
              <div className="divide-y divide-cream-100">
                {lowStockVehicles.map((v) => (
                  <div key={v.id} className="flex items-center justify-between py-3 gap-3">
                    <div>
                      <p className="font-semibold text-ink-900 text-sm">{v.make} {v.model}</p>
                      <p className="text-xs text-amber-600 mt-0.5 font-medium">Only {v.quantity} remaining</p>
                    </div>
                    <Link to="/workspace" className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-semibold border border-primary-200 transition-all">
                      Manage →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── ADMIN HOME ──────────────────────────────────────────────────────────────
  if (user?.role === 'admin') {
    return (
      <div className="flex-1 relative overflow-hidden bg-cream-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="anim-blob-1 absolute -top-20 right-0 w-80 h-80 bg-violet-500/7 blur-3xl rounded-full" />
          <div className="anim-blob-2 absolute bottom-0 -left-20 w-72 h-72 bg-primary-500/6 blur-3xl rounded-full" />
          <div className="anim-blob-4 absolute top-1/3 left-1/2 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white border border-cream-200 rounded-2xl shadow-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 anim-fade-up">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-violet-600">Executive Leadership Overview</span>
              <h1 className="text-2xl font-bold text-ink-900 mt-1">Executive Dashboard — {user.name}</h1>
              <p className="text-sm text-ink-500 mt-0.5">Real-time portfolio valuation &amp; dealership operation health.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/workspace" className="px-4 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-ink-700 text-sm font-medium border border-cream-200 transition-all">
                Operational Workspace
              </Link>
              <Link to="/admin" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-sm shadow-violet-500/20 transition-all">
                <i className="bx bxs-shield text-base" />
                Administration Portal
              </Link>
            </div>
          </div>

          {/* Executive KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Portfolio Value', value: `₹${totalValue.toLocaleString('en-IN')}`, color: 'bg-primary-500', small: true },
              { label: 'Catalog Listings', value: totalListings, color: 'bg-blue-500' },
              { label: 'Out of Stock Alerts', value: outOfStockCount, color: 'bg-red-500' },
              { label: 'Low Stock Alerts', value: lowStockVehicles.length, color: 'bg-amber-400' },
            ].map(({ label, value, color, small }) => (
              <div key={label} className="gs-stat-card">
                <div className={`absolute top-0 inset-x-0 h-[3px] ${color} rounded-t-2xl`} />
                <p className="text-xs text-ink-500 font-medium pt-1">{label}</p>
                <p className={`font-bold text-ink-900 mt-1.5 ${small ? 'text-lg' : 'text-2xl'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Quick Management Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { to: '/workspace', label: 'Inventory Management', desc: 'Add, edit, restock, and record vehicle transactions.', icon: 'bxs-briefcase', color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100', hover: 'hover:border-primary-300' },
              { to: '/admin', label: 'System Administration', desc: 'Monitor API status, database health, and system alerts.', icon: 'bxs-bar-chart-alt-2', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', hover: 'hover:border-violet-300' },
              { to: '/inventory', label: 'Showroom Catalog', desc: 'View customer-facing showroom inventory &amp; pricing.', icon: 'bxs-car', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', hover: 'hover:border-blue-300' },
            ].map(({ to, label, desc, icon, color, bg, border, hover }) => (
              <Link key={to} to={to} className={`bg-white border border-cream-200 ${hover} hover:shadow-card-md rounded-2xl p-5 flex items-center justify-between group transition-all shadow-card`}>
                <div>
                  <p className={`font-bold text-ink-900 group-hover:${color} transition-colors text-sm`}>{label}</p>
                  <p className="text-xs text-ink-500 mt-1" dangerouslySetInnerHTML={{ __html: desc }} />
                </div>
                <div className={`p-2.5 rounded-xl ${bg} border ${border} group-hover:scale-105 transition-transform`}>
                  <i className={`bx ${icon} text-xl ${color}`} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── CUSTOMER / PUBLIC SHOWROOM HOME ────────────────────────────────────────
  return (
    <div className="flex-1 bg-cream-100 flex flex-col">

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20 px-4 sm:px-6 lg:px-8">
        {/* Animated background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="anim-blob-1 absolute -top-32 -left-20 w-[500px] h-[400px] bg-primary-500/10 blur-3xl rounded-full" />
          <div className="anim-blob-2 absolute top-10 right-0 w-[400px] h-[350px] bg-teal-500/7 blur-3xl rounded-full" />
          <div className="anim-blob-3 absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-blue-500/6 blur-3xl rounded-full" />
          <div className="anim-blob-4 absolute top-1/2 left-1/2 w-[250px] h-[250px] bg-violet-500/5 blur-3xl rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-cream-200 shadow-card text-ink-600 text-xs font-semibold mb-6">
            <i className="bx bxs-award text-sm text-primary-500" />
            India's Premier Digital Dealership Network
          </div>

          {/* Display headline */}
          <h1 className="font-display italic text-4xl sm:text-5xl lg:text-[58px] font-bold text-ink-900 tracking-tight leading-tight">
            Engineered for the{' '}
            <span className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-400">
              Modern Dealership
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-ink-500 max-w-2xl mx-auto leading-relaxed">
            Explore ex-showroom INR pricing, verified real-time stock availability, and instant
            booking across top Indian automotive manufacturers.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/inventory"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white font-bold text-sm shadow-sm shadow-primary-500/25 transition-all anim-pulse-glow"
            >
              Browse Full Inventory
              <i className="bx bx-right-arrow-alt text-xl" />
            </Link>
          </div>

          {/* Highlights */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            {[
              { icon: 'bxs-car', bg: 'bg-primary-50', border: 'border-primary-100', color: 'text-primary-600', title: `${totalListings || 20}+ Models`, sub: 'Verified Indian Market Vehicles' },
              { icon: 'bxs-zap', bg: 'bg-blue-50', border: 'border-blue-100', color: 'text-blue-600', title: 'EV & Hybrids', sub: 'Next-gen green mobility options' },
              { icon: 'bxs-shield-alt-2', bg: 'bg-violet-50', border: 'border-violet-100', color: 'text-violet-600', title: '100% Transparent', sub: 'Real-time stock & Ex-Showroom INR' },
            ].map(({ icon, bg, border, color, title, sub }) => (
              <div key={title} className="bg-white border border-cream-200 rounded-2xl p-4 flex items-center gap-3 shadow-card">
                <div className={`p-2.5 rounded-xl ${bg} border ${border} ${color} shrink-0`}>
                  <i className={`bx ${icon} text-base`} />
                </div>
                <div>
                  <p className="text-base font-bold text-ink-900">{title}</p>
                  <p className="text-xs text-ink-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-primary-600 mb-1">Curated Selection</p>
            <h2 className="text-2xl font-bold text-ink-900">Featured Vehicles</h2>
            <p className="text-sm text-ink-500 mt-0.5">Handpicked Indian market favorites currently in stock</p>
          </div>
          <Link to="/inventory" className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors shrink-0">
            View all
            <i className="bx bx-right-arrow-alt text-lg" />
          </Link>
        </div>

        {featuredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((v) => {
              const g = CATEGORY_GRADIENTS[v.category] || CATEGORY_GRADIENTS.SEDAN;
              const bxIcon = CATEGORY_BXICON[v.category] || 'bxs-car';
              const iconColor = CATEGORY_ICON_COLOR[v.category] || 'text-blue-400';
              return (
                <div key={v.id} className="bg-white border border-cream-200 rounded-2xl shadow-card hover:shadow-card-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
                  <div className={`h-40 bg-gradient-to-br ${g} flex items-center justify-center relative`}>
                    <i className={`bx ${bxIcon} text-[60px] ${iconColor} anim-float opacity-80`} />
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/80 border border-cream-200 text-ink-600">
                        {v.quantity} in stock
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-semibold text-ink-600 uppercase tracking-wider">{v.category}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-ink-900">{v.make} {v.model}</h3>
                    <div className="mt-auto pt-4 border-t border-cream-100 mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-ink-400">Ex-Showroom Price</p>
                        <p className="text-xl font-extrabold text-ink-900">₹{v.price.toLocaleString('en-IN')}</p>
                      </div>
                      <Link to="/inventory" className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-all shadow-sm">
                        View &amp; Buy
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-cream-200 rounded-2xl shadow-card">
            <i className="bx bxs-car text-4xl text-ink-300 mb-2 block" />
            <p className="text-ink-400 text-sm">Explore our catalog of vehicles in stock.</p>
          </div>
        )}
      </section>

      {/* Value Props */}
      <section className="bg-white border-t border-cream-200 py-14 px-4 sm:px-6 lg:px-8 mt-auto relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="anim-blob-3 absolute -bottom-20 right-0 w-64 h-64 bg-primary-500/5 blur-3xl rounded-full" />
          <div className="anim-blob-1 absolute top-0 left-0 w-48 h-48 bg-blue-500/4 blur-3xl rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <p className="text-[11px] uppercase tracking-widest font-semibold text-primary-600 text-center mb-8">Why GearShift</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: 'bxs-shield-alt-2', bg: 'bg-primary-50', border: 'border-primary-100', color: 'text-primary-600', title: 'Verified Dealership Network', desc: 'All listings come with transparent documentation and genuine manufacturer warranty.' },
              { icon: 'bxs-package', bg: 'bg-blue-50', border: 'border-blue-100', color: 'text-blue-600', title: 'Live Inventory Sync', desc: 'Real-time stock tracking ensures you never book an out-of-stock vehicle.' },
              { icon: 'bxs-slider', bg: 'bg-violet-50', border: 'border-violet-100', color: 'text-violet-600', title: 'Dedicated Staff Support', desc: 'Our dealership staff manages test drives, financing, and delivery seamlessly.' },
            ].map(({ icon, bg, border, color, title, desc }) => (
              <div key={title}>
                <div className={`inline-flex p-3.5 rounded-2xl ${bg} border ${border} ${color} mb-4`}>
                  <i className={`bx ${icon} text-2xl`} />
                </div>
                <h3 className="text-base font-bold text-ink-900">{title}</h3>
                <p className="text-xs text-ink-500 mt-2 max-w-xs mx-auto leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

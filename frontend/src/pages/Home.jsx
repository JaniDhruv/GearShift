import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Car,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  Briefcase,
  AlertTriangle,
  TrendingUp,
  SlidersHorizontal,
  PlusCircle,
  PackageCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getVehicles } from '../services/vehicleService';

export default function Home() {
  const { user } = useAuth();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles', 'all'],
    queryFn: getVehicles,
    staleTime: 30 * 1000,
  });

  const totalListings = vehicles.length;
  const inStockCount = vehicles.filter((v) => v.quantity > 0).length;
  const lowStockVehicles = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3);
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;
  const totalValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);

  // Featured vehicles for customer showroom
  const featuredVehicles = vehicles.slice(0, 3);

  // STAFF HOME
  if (user?.role === 'staff') {
    return (
      <div className="flex-1 bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Staff Operations Hub
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">
                Good day, {user.name}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Here is today's inventory operational overview.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/inventory"
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium transition-all"
              >
                Browse Inventory
              </Link>
              <Link
                to="/workspace"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-semibold text-sm shadow-md shadow-emerald-500/20 transition-all"
              >
                <Briefcase className="w-4 h-4" />
                Open Workspace
              </Link>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 font-medium">Total Active Listings</p>
              <p className="text-2xl font-bold text-white mt-1">{totalListings}</p>
            </div>
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 font-medium">In-Stock Units</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                {vehicles.reduce((acc, v) => acc + v.quantity, 0)}
              </p>
            </div>
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 font-medium">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">
                {lowStockVehicles.length}
              </p>
            </div>
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 font-medium">Total Inventory Value</p>
              <p className="text-xl font-bold text-white mt-1">
                ₹{totalValue.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Attention / Low Stock Table */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Units Requiring Attention (Low Stock)
            </h2>
            {lowStockVehicles.length === 0 ? (
              <p className="text-sm text-gray-500">All vehicles have healthy stock levels.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lowStockVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {v.make} {v.model}
                      </p>
                      <p className="text-xs text-yellow-400 mt-0.5 font-medium">
                        Only {v.quantity} remaining
                      </p>
                    </div>
                    <Link
                      to="/workspace"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-all"
                    >
                      Manage
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

  // ADMIN HOME
  if (user?.role === 'admin') {
    return (
      <div className="flex-1 bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-purple-400">
                Executive Leadership Overview
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">
                Executive Dashboard — {user.name}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Real-time portfolio valuation & dealership operation health.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/workspace"
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium transition-all"
              >
                Operational Workspace
              </Link>
              <Link
                to="/admin"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-600/20 transition-all"
              >
                Administration Portal
              </Link>
            </div>
          </div>

          {/* Executive KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 font-medium">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                ₹{totalValue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 font-medium">Catalog Listings</p>
              <p className="text-2xl font-bold text-white mt-1">{totalListings}</p>
            </div>
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 font-medium">Out of Stock Alerts</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{outOfStockCount}</p>
            </div>
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 font-medium">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">
                {lowStockVehicles.length}
              </p>
            </div>
          </div>

          {/* Quick Management Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/workspace"
              className="bg-gray-900/60 border border-gray-800 hover:border-emerald-500/50 rounded-2xl p-5 flex items-center justify-between group transition-all"
            >
              <div>
                <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Inventory Management
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Add, edit, restock, and record vehicle transactions.
                </p>
              </div>
              <Briefcase className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            </Link>

            <Link
              to="/admin"
              className="bg-gray-900/60 border border-gray-800 hover:border-purple-500/50 rounded-2xl p-5 flex items-center justify-between group transition-all"
            >
              <div>
                <p className="font-bold text-white group-hover:text-purple-400 transition-colors">
                  System Administration
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Monitor API status, database health, and system alerts.
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            </Link>

            <Link
              to="/inventory"
              className="bg-gray-900/60 border border-gray-800 hover:border-blue-500/50 rounded-2xl p-5 flex items-center justify-between group transition-all"
            >
              <div>
                <p className="font-bold text-white group-hover:text-blue-400 transition-colors">
                  Showroom Catalog
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  View customer-facing showroom inventory & pricing.
                </p>
              </div>
              <Car className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // CUSTOMER / PUBLIC SHOWROOM HOME
  return (
    <div className="flex-1 bg-gray-950 flex flex-col">
      {/* Hero Showroom Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-800/80">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
            <Award className="w-3.5 h-3.5" />
            India's Premier Digital Dealership Network
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Find Your Next Vehicle with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Transparent Pricing
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Explore ex-showroom INR pricing, verified real-time stock availability, and instant
            booking across top Indian automotive manufacturers.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/inventory"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-gray-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
            >
              Browse Full Inventory
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Highlights Banner */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{totalListings || 20}+ Models</p>
                <p className="text-xs text-gray-400">Verified Indian Market Vehicles</p>
              </div>
            </div>

            <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">EV & Hybrids</p>
                <p className="text-xs text-gray-400">Next-gen green mobility options</p>
              </div>
            </div>

            <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">100% Transparent</p>
                <p className="text-xs text-gray-400">Real-time stock & Ex-Showroom INR</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Showroom Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Vehicles</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Handpicked Indian market favorites currently in stock
            </p>
          </div>
          <Link
            to="/inventory"
            className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View all vehicles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((v) => (
              <div
                key={v.id}
                className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-gray-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                      {v.category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {v.quantity} in stock
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {v.make} {v.model}
                  </h3>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Ex-Showroom Price</p>
                    <p className="text-xl font-extrabold text-white">
                      ₹{v.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Link
                    to="/inventory"
                    className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-sm font-semibold transition-all"
                  >
                    View & Purchase
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900/40 border border-gray-800 rounded-2xl">
            <p className="text-gray-400 text-sm">Explore our catalog of vehicles in stock.</p>
          </div>
        )}
      </section>

      {/* Value Proposition Footer Strip */}
      <section className="bg-gray-900/40 border-t border-gray-800/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Verified Dealership Network</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              All listings come with transparent documentation and genuine manufacturer warranty.
            </p>
          </div>

          <div>
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-3">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Live Inventory Sync</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Real-time stock tracking ensures you never book an out-of-stock vehicle.
            </p>
          </div>

          <div>
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-3">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Dedicated Staff Support</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Our dealership staff manages test drives, financing, and delivery seamlessly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

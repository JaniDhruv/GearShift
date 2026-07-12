import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  Car,
  Settings,
  AlertTriangle,
  Database,
  Activity,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
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
  const lowStock = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3);

  return (
    <div className="flex-1 flex flex-col bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Administration Portal</h1>
                <p className="text-sm text-gray-400">
                  System Health, Role Diagnostics & Dealership Alerts
                </p>
              </div>
            </div>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-semibold text-sm transition-all"
            >
              <Briefcase className="w-4 h-4" />
              Open Operational Workspace
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* System Health Section */}
        <div>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Platform System Health
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Database Connected</p>
                  <p className="text-sm font-bold text-white">MongoDB Localhost</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">API Core Server</p>
                  <p className="text-sm font-bold text-white">Online (Port 5000)</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">JWT Authorization</p>
                  <p className="text-sm font-bold text-white">Active & Secured</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Users / Role Metrics Overview */}
        <div>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            Dealership Role Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Platform Administrators</p>
                <p className="text-2xl font-bold text-white mt-1">1</p>
                <p className="text-xs text-purple-400 mt-1">Executive Access</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500/30" />
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Dealership Staff</p>
                <p className="text-2xl font-bold text-white mt-1">1</p>
                <p className="text-xs text-emerald-400 mt-1">Operational Workspace</p>
              </div>
              <Briefcase className="w-8 h-8 text-emerald-500/30" />
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Registered Customers</p>
                <p className="text-2xl font-bold text-white mt-1">Active</p>
                <p className="text-xs text-blue-400 mt-1">Showroom Purchasing</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-500/30" />
            </div>
          </div>
        </div>

        {/* Inventory Alerts Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Inventory Stock Alerts ({outOfStock.length + lowStock.length})
            </h2>
            <Link
              to="/workspace"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Resolve in Workspace <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {outOfStock.length > 0 || lowStock.length > 0 ? (
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
              <div className="divide-y divide-gray-800">
                {[...outOfStock, ...lowStock].map((v) => (
                  <div key={v.id} className="flex items-center justify-between py-3.5 gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {v.make} {v.model}
                      </p>
                      <p className="text-xs text-gray-400">
                        {v.category} • Ex-Showroom: ₹{v.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                          v.quantity === 0
                            ? 'text-red-400 bg-red-500/10 border-red-500/20'
                            : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                        }`}
                      >
                        {v.quantity === 0 ? 'Out of stock (0)' : `Low stock (${v.quantity} left)`}
                      </span>
                      <Link
                        to="/workspace"
                        className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-medium text-white transition-all"
                      >
                        Restock
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-8 text-center text-gray-400 text-sm">
              All inventory units have healthy stock counts across India.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

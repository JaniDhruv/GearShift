import React from 'react';
import { Shield, Users, Car, Settings, AlertTriangle } from 'lucide-react';
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
  const lowStock = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 2);

  return (
    <div className="flex-1 flex flex-col bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Portal</h1>
              <p className="text-sm text-gray-400">
                Signed in as <span className="text-purple-400 font-medium">{user?.name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Vehicles</p>
              <p className="text-2xl font-bold text-white">{vehicles.length}</p>
            </div>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold text-white">{outOfStock.length}</p>
            </div>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Low Stock (≤2)</p>
              <p className="text-2xl font-bold text-white">{lowStock.length}</p>
            </div>
          </div>
        </div>

        {/* Attention list */}
        {(outOfStock.length > 0 || lowStock.length > 0) && (
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Requires Attention
            </h2>
            <div className="divide-y divide-gray-800">
              {[...outOfStock, ...lowStock].map((v) => (
                <div key={v.id} className="flex items-center justify-between py-3 gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{v.make} {v.model}</p>
                    <p className="text-xs text-gray-400">{v.category}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                      v.quantity === 0
                        ? 'text-red-400 bg-red-500/10 border-red-500/20'
                        : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                    }`}
                  >
                    {v.quantity === 0 ? 'Out of stock' : `${v.quantity} left`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {outOfStock.length === 0 && lowStock.length === 0 && vehicles.length > 0 && (
          <div className="text-center py-16 text-gray-500">
            <Car className="w-10 h-10 mx-auto mb-3 text-gray-700" />
            <p className="text-sm">All vehicles are well-stocked. No actions required.</p>
          </div>
        )}
      </div>
    </div>
  );
}

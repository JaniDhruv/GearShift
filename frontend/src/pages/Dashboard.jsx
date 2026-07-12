import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Car, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getVehicles } from '../services/vehicleService';
import VehicleCard from '../components/ui/VehicleCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

const STATS_CONFIG = [
  { label: 'Total Listings', getValue: (v) => v.length },
  { label: 'In Stock', getValue: (v) => v.filter((x) => x.quantity > 0).length },
  { label: 'Out of Stock', getValue: (v) => v.filter((x) => x.quantity === 0).length },
  {
    label: 'Total Value',
    getValue: (v) =>
      '$' +
      v
        .reduce((sum, x) => sum + x.price * x.quantity, 0)
        .toLocaleString('en-US', { maximumFractionDigits: 0 }),
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const {
    data: vehicles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
    staleTime: 60 * 1000,
  });

  return (
    <div className="flex-1 flex flex-col bg-gray-950 min-h-0">
      {/* Page header */}
      <div className="border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Inventory Dashboard
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {user ? `Welcome back, ${user.name}` : 'Vehicle inventory overview'}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 bg-gray-900/60 hover:bg-gray-800 transition-all"
              aria-label="Refresh inventory"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {/* Stats strip */}
          {!isLoading && !isError && vehicles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {STATS_CONFIG.map(({ label, getValue }) => (
                <div key={label} className="bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-lg font-bold text-white mt-0.5">{getValue(vehicles)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {isLoading && <LoadingSkeleton count={12} />}

        {isError && (
          <EmptyState
            icon={AlertCircle}
            title="Failed to load inventory"
            description={error?.message || 'There was a problem fetching vehicles. Please try again.'}
            action={
              <button
                onClick={() => refetch()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 text-sm font-semibold transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
            }
          />
        )}

        {!isLoading && !isError && vehicles.length === 0 && (
          <EmptyState
            icon={Car}
            title="No vehicles in inventory"
            description="The inventory is currently empty. Vehicles added by staff will appear here."
          />
        )}

        {!isLoading && !isError && vehicles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onClick={setSelectedVehicle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

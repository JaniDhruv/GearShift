import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Car, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getVehicles, searchVehicles, purchaseVehicle } from '../services/vehicleService';
import useDebounce from '../hooks/useDebounce';
import VehicleCard from '../components/ui/VehicleCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import SearchBar from '../components/ui/SearchBar';
import VehicleDetailModal from '../components/ui/VehicleDetailModal';
import PurchaseConfirmModal from '../components/ui/PurchaseConfirmModal';
import FilterPanel from '../components/ui/FilterPanel';
import toast from 'react-hot-toast';

const EMPTY_FILTERS = { category: '', minPrice: '', maxPrice: '' };

const STATS_CONFIG = [
  { label: 'Total Listings', getValue: (v) => v.length },
  { label: 'In Stock', getValue: (v) => v.filter((x) => x.quantity > 0).length },
  { label: 'Out of Stock', getValue: (v) => v.filter((x) => x.quantity === 0).length },
  {
    label: 'Total Inventory Value',
    getValue: (v) =>
      '₹' +
      v
        .reduce((sum, x) => sum + x.price * x.quantity, 0)
        .toLocaleString('en-IN', { maximumFractionDigits: 0 }),
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isStaffOrAdmin = user?.role === 'staff' || user?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [purchaseVehicleTarget, setPurchaseVehicleTarget] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const isFiltering =
    debouncedSearch.trim() || filters.category || filters.minPrice || filters.maxPrice;

  // Build query params for /vehicles/search
  const searchParams = {
    ...(debouncedSearch.trim() && {
      make: debouncedSearch.trim(),
    }),
    ...(filters.category && { category: filters.category }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
  };

  const {
    data: vehicles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['vehicles', isFiltering ? searchParams : 'all'],
    queryFn: isFiltering ? () => searchVehicles(searchParams) : getVehicles,
    staleTime: 30 * 1000,
    keepPreviousData: true,
  });

  const purchaseMutation = useMutation({
    mutationFn: (id) => purchaseVehicle(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      const previousVehicles = queryClient.getQueryData(['vehicles']);

      queryClient.setQueryData(['vehicles'], (old = []) =>
        old.map((v) => (v.id === id ? { ...v, quantity: Math.max(0, v.quantity - 1) } : v))
      );

      return { previousVehicles };
    },
    onError: (err, id, context) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(['vehicles'], context.previousVehicles);
      }
      const msg = err?.response?.data?.error || 'Purchase failed. Please try again.';
      toast.error(msg);
    },
    onSuccess: () => {
      toast.success(
        isStaffOrAdmin ? 'Vehicle sale recorded successfully.' : 'Vehicle purchased successfully.'
      );
      setPurchaseVehicleTarget(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const handleReset = () => {
    setSearchTerm('');
    setFilters(EMPTY_FILTERS);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-950 min-h-0">
      {/* Sticky page header */}
      <div className="border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Inventory Dashboard</h1>
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
          {!isLoading && !isError && vehicles.length > 0 && !isFiltering && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {STATS_CONFIG.map(({ label, getValue }) => (
                <div key={label} className="bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-lg font-bold text-white mt-0.5">{getValue(vehicles)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Search + Filters */}
          <div className="mt-4 flex flex-col gap-3">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <FilterPanel filters={filters} onChange={setFilters} onReset={handleReset} />
          </div>
        </div>
      </div>

      {/* Content grid */}
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
            title={isFiltering ? 'No vehicles match your search' : 'No vehicles in inventory'}
            description={
              isFiltering
                ? 'Try adjusting your search term or filters.'
                : 'The inventory is currently empty. Vehicles added by staff will appear here.'
            }
            action={
              isFiltering && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-all"
                >
                  Clear filters
                </button>
              )
            }
          />
        )}

        {!isLoading && !isError && vehicles.length > 0 && (
          <>
            <p className="text-xs text-gray-500 mb-4">
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} found
              {isFiltering && ' for current filters'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onClick={setSelectedVehicle}
                  onPurchaseClick={setPurchaseVehicleTarget}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Vehicle detail modal */}
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onPurchaseClick={(v) => {
            setSelectedVehicle(null);
            setPurchaseVehicleTarget(v);
          }}
        />
      )}

      {/* Customer Purchase / Staff Record Sale Confirmation Modal */}
      <PurchaseConfirmModal
        isOpen={Boolean(purchaseVehicleTarget)}
        onClose={() => setPurchaseVehicleTarget(null)}
        onConfirm={() => purchaseMutation.mutate(purchaseVehicleTarget.id)}
        vehicle={purchaseVehicleTarget}
        isStaffOrAdmin={isStaffOrAdmin}
        isPending={purchaseMutation.isPending}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  { label: 'Total Listings',        getValue: (v) => v.length,                             accentColor: 'bg-blue-500' },
  { label: 'In Stock',              getValue: (v) => v.filter((x) => x.quantity > 0).length, accentColor: 'bg-primary-500' },
  { label: 'Out of Stock',          getValue: (v) => v.filter((x) => x.quantity === 0).length, accentColor: 'bg-red-500' },
  {
    label: 'Total Inventory Value',
    accentColor: 'bg-violet-500',
    getValue: (v) =>
      '₹' + v.reduce((sum, x) => sum + x.price * x.quantity, 0)
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
  const isFiltering = debouncedSearch.trim() || filters.category || filters.minPrice || filters.maxPrice;

  const searchParams = {
    ...(debouncedSearch.trim() && { make: debouncedSearch.trim() }),
    ...(filters.category && { category: filters.category }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
  };

  const { data: vehicles = [], isLoading, isError, error, refetch } = useQuery({
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
      if (context?.previousVehicles) queryClient.setQueryData(['vehicles'], context.previousVehicles);
      const msg = err?.response?.data?.error || 'Purchase failed. Please try again.';
      toast.error(msg);
    },
    onSuccess: () => {
      toast.success(isStaffOrAdmin ? 'Vehicle sale recorded successfully.' : 'Vehicle purchased successfully.');
      setPurchaseVehicleTarget(null);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });

  const handleReset = () => { setSearchTerm(''); setFilters(EMPTY_FILTERS); };

  return (
    <div className="flex-1 flex flex-col bg-cream-100 min-h-0 relative overflow-hidden">
      {/* Background blobs behind everything */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
        <div className="anim-blob-1 absolute top-20 -right-20 w-96 h-96 bg-primary-500/5 blur-3xl rounded-full" />
        <div className="anim-blob-3 absolute bottom-20 -left-20 w-80 h-80 bg-blue-500/5 blur-3xl rounded-full" />
      </div>

      {/* Sticky page header */}
      <div className="border-b border-cream-200 bg-white/95 backdrop-blur-sm sticky top-[60px] z-30 shadow-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest font-semibold text-primary-600 mb-0.5">Showroom</p>
              <h1 className="text-xl font-bold text-ink-900 tracking-tight">Vehicle Inventory</h1>
              <p className="text-sm text-ink-500 mt-0.5">Browse ex-showroom pricing and real-time stock availability across India</p>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-ink-500 hover:text-ink-900 border border-cream-200 hover:border-cream-300 bg-white hover:bg-cream-50 transition-all shadow-card shrink-0"
              aria-label="Refresh inventory"
            >
              <i className="bx bx-refresh text-base" />
              Refresh
            </button>
          </div>

          {/* Stats strip */}
          {!isLoading && !isError && vehicles.length > 0 && !isFiltering && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {STATS_CONFIG.map(({ label, getValue, accentColor }) => (
                <div key={label} className="bg-white border border-cream-200 rounded-xl px-4 py-3 relative overflow-hidden shadow-card">
                  <div className={`absolute top-0 inset-x-0 h-[3px] ${accentColor} rounded-t-xl`} />
                  <p className="text-[11px] text-ink-400 font-medium pt-0.5">{label}</p>
                  <p className="text-lg font-bold text-ink-900 mt-0.5">{getValue(vehicles)}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <FilterPanel filters={filters} onChange={setFilters} onReset={handleReset} />
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 relative z-10">
        {isLoading && <LoadingSkeleton count={12} />}

        {isError && (
          <EmptyState
            iconClass="bxs-error-circle"
            title="Failed to load inventory"
            description={error?.message || 'There was a problem fetching vehicles. Please try again.'}
            action={
              <button onClick={() => refetch()} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-all">
                <i className="bx bx-refresh text-base" />
                Try again
              </button>
            }
          />
        )}

        {!isLoading && !isError && vehicles.length === 0 && (
          <EmptyState
            iconClass="bxs-car"
            title={isFiltering ? 'No vehicles match your search' : 'No vehicles in inventory'}
            description={isFiltering ? 'Try adjusting your search term or filters.' : 'The inventory is currently empty. Vehicles added by staff will appear here.'}
            action={isFiltering && (
              <button onClick={handleReset} className="px-4 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-ink-700 text-sm font-medium transition-all">
                Clear filters
              </button>
            )}
          />
        )}

        {!isLoading && !isError && vehicles.length > 0 && (
          <>
            <p className="text-xs text-ink-400 mb-4 font-medium">
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} found
              {isFiltering && ' for current filters'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={setSelectedVehicle} onPurchaseClick={setPurchaseVehicleTarget} />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onPurchaseClick={(v) => { setSelectedVehicle(null); setPurchaseVehicleTarget(v); }}
        />
      )}

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

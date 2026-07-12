import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import {
  getVehicles, createVehicle, updateVehicle,
  purchaseVehicle, restockVehicle, deleteVehicle,
} from '../services/vehicleService';
import Modal from '../components/ui/Modal';
import VehicleForm from '../components/ui/VehicleForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const CATEGORY_BADGE = {
  SEDAN:    'bg-blue-50 text-blue-600 border-blue-200',
  SUV:      'bg-violet-50 text-violet-600 border-violet-200',
  HATCHBACK:'bg-amber-50 text-amber-700 border-amber-200',
  TRUCK:    'bg-orange-50 text-orange-600 border-orange-200',
  SPORTS:   'bg-red-50 text-red-600 border-red-200',
  LUXURY:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  ELECTRIC: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  HYBRID:   'bg-teal-50 text-teal-600 border-teal-200',
};

const MAKE_COLORS = [
  'bg-primary-500', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500',
  'bg-red-500', 'bg-cyan-500', 'bg-teal-500', 'bg-orange-500',
];

function getMakeColor(make = '') {
  return MAKE_COLORS[make.charCodeAt(0) % MAKE_COLORS.length];
}

export default function Workspace() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();

  const [isAddOpen,      setIsAddOpen]      = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [saleVehicle,    setSaleVehicle]    = useState(null);
  const [deleteTarget,   setDeleteTarget]   = useState(null);
  const [restockTarget,  setRestockTarget]  = useState(null);

  const { data: vehicles = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
    staleTime: 30 * 1000,
  });

  // 1. Create
  const createMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: (newVehicle) => {
      queryClient.setQueryData(['vehicles'], (old = []) => [newVehicle, ...old]);
      toast.success(`${newVehicle.make} ${newVehicle.model} added to inventory`);
      setIsAddOpen(false);
    },
    onError: (err) => toast.error(err?.response?.data?.error || 'Failed to add vehicle'),
  });

  // 2. Update
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateVehicle(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['vehicles'], (old = []) =>
        old.map((v) => (v.id === updated.id ? updated : v))
      );
      toast.success(`${updated.make} ${updated.model} updated successfully`);
      setEditingVehicle(null);
    },
    onError: (err) => toast.error(err?.response?.data?.error || 'Failed to update vehicle'),
  });

  // 3. Optimistic Sale
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
      toast.error(err?.response?.data?.error || 'Failed to record sale');
    },
    onSuccess: (updated) => {
      toast.success(`Recorded sale for ${updated.make} ${updated.model}`);
      setSaleVehicle(null);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });

  // 4. Delete (Admin)
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteVehicle(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      const previousVehicles = queryClient.getQueryData(['vehicles']);
      queryClient.setQueryData(['vehicles'], (old = []) => old.filter((v) => v.id !== id));
      return { previousVehicles };
    },
    onError: (err, id, context) => {
      if (context?.previousVehicles) queryClient.setQueryData(['vehicles'], context.previousVehicles);
      toast.error('Failed to delete vehicle');
    },
    onSuccess: () => { toast.success('Vehicle deleted from inventory'); setDeleteTarget(null); },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });

  // 5. Restock (Admin)
  const restockMutation = useMutation({
    mutationFn: ({ id, quantity }) => restockVehicle(id, quantity),
    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      const previousVehicles = queryClient.getQueryData(['vehicles']);
      queryClient.setQueryData(['vehicles'], (old = []) =>
        old.map((v) => (v.id === id ? { ...v, quantity: v.quantity + Number(quantity) } : v))
      );
      return { previousVehicles };
    },
    onError: (err, vars, context) => {
      if (context?.previousVehicles) queryClient.setQueryData(['vehicles'], context.previousVehicles);
      toast.error('Failed to restock vehicle');
    },
    onSuccess: (updated) => { toast.success(`Restocked ${updated.make} ${updated.model}`); setRestockTarget(null); },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });

  return (
    <div className="flex-1 flex flex-col bg-cream-100 min-h-0 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
        <div className="anim-blob-2 absolute -top-16 -right-16 w-80 h-80 bg-primary-500/6 blur-3xl rounded-full" />
        <div className="anim-blob-4 absolute bottom-10 left-0 w-72 h-72 bg-blue-500/5 blur-3xl rounded-full" />
      </div>

      {/* Workspace Header */}
      <div className="border-b border-cream-200 bg-white relative z-10 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest font-semibold text-primary-600 mb-0.5">
                {user?.role || 'staff'} · Operational
              </p>
              <h1 className="text-xl font-bold text-ink-900 tracking-tight flex items-center gap-2">
                <i className="bx bx-list-ul text-xl text-ink-400" />
                Inventory Workspace
              </h1>
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-sm shadow-primary-500/20 anim-pulse-glow"
            >
              <i className="bx bx-plus text-base" />
              Add Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* Stat Chips Banner */}
      {!isLoading && !isError && vehicles.length > 0 && (
        <div className="bg-white border-b border-cream-200 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-6 flex-wrap text-xs">
            {[
              { dot: 'bg-blue-400', label: 'Total Listings', value: vehicles.length },
              { dot: 'bg-primary-500', label: 'In-Stock Units', value: vehicles.reduce((sum, v) => sum + v.quantity, 0) },
            ].map(({ dot, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-ink-500">{label}: <strong className="text-ink-900 font-bold">{value}</strong></span>
              </div>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-ink-400">Portfolio MSRP Value:</span>
              <strong className="text-primary-600 font-bold">
                ₹{vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0).toLocaleString('en-IN')}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 relative z-10">
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <i className="bx bx-loader-alt text-4xl text-primary-500 anim-spin-slow" />
          </div>
        )}

        {isError && (
          <EmptyState
            iconClass="bxs-error-circle"
            title="Failed to load workspace inventory"
            description={error?.message || 'There was a problem fetching vehicles.'}
            action={
              <button onClick={() => refetch()} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-all">
                <i className="bx bx-refresh text-base" />
                Retry
              </button>
            }
          />
        )}

        {!isLoading && !isError && vehicles.length === 0 && (
          <EmptyState
            iconClass="bxs-car"
            title="No vehicles in workspace"
            description="Get started by adding your dealership's first vehicle inventory entry."
            action={
              <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-all">
                <i className="bx bx-plus text-base" />
                Add Vehicle
              </button>
            }
          />
        )}

        {!isLoading && !isError && vehicles.length > 0 && (
          <div className="bg-white border border-cream-200 rounded-2xl shadow-card overflow-hidden">
            {/* Column headers */}
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-cream-100 bg-cream-50">
              {['Vehicle', 'Price', 'Stock', 'Actions'].map((h) => (
                <span key={h} className="text-[11px] uppercase tracking-wider font-semibold text-ink-400">{h}</span>
              ))}
            </div>

            <div className="divide-y divide-cream-100">
              {vehicles.map((vehicle) => {
                const inStock = vehicle.quantity > 0;
                const isMutatingThis =
                  (purchaseMutation.isPending && purchaseMutation.variables === vehicle.id) ||
                  (deleteMutation.isPending && deleteMutation.variables === vehicle.id);
                const badgeClass = CATEGORY_BADGE[vehicle.category] || 'bg-cream-100 text-ink-500 border-cream-200';
                const avatarColor = getMakeColor(vehicle.make);

                return (
                  <div
                    key={vehicle.id}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-cream-50/60 transition-colors ${isMutatingThis ? 'opacity-60 pointer-events-none' : ''}`}
                  >
                    {/* Vehicle Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${avatarColor} text-white shrink-0 font-bold text-base`}>
                        {vehicle.make.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-ink-900 text-sm truncate">{vehicle.make} {vehicle.model}</h3>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                            {vehicle.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="sm:w-32 sm:text-right shrink-0">
                      <p className="font-bold text-ink-900 text-sm">₹{vehicle.price.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-ink-400">Ex-showroom</p>
                    </div>

                    {/* Stock */}
                    <div className="sm:w-28 sm:text-right shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        inStock
                          ? vehicle.quantity <= 3
                            ? 'text-amber-700 bg-amber-50 border-amber-200'
                            : 'text-primary-700 bg-primary-50 border-primary-200'
                          : 'text-red-600 bg-red-50 border-red-200'
                      }`}>
                        {inStock ? `${vehicle.quantity} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      <button onClick={() => setEditingVehicle(vehicle)} disabled={isMutatingThis}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 border border-cream-200 text-ink-600 hover:text-ink-900 text-xs font-medium transition-all">
                        <i className="bx bxs-edit text-sm" /> Edit
                      </button>

                      <button onClick={() => setSaleVehicle(vehicle)} disabled={!inStock || isMutatingThis}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        <i className="bx bxs-cart text-sm" /> Record Sale
                      </button>

                      {isAdmin && (
                        <button onClick={() => setRestockTarget(vehicle)} disabled={isMutatingThis}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 text-xs font-medium transition-all">
                          <i className="bx bx-revision text-sm" /> Restock
                        </button>
                      )}

                      {isAdmin && (
                        <button onClick={() => setDeleteTarget(vehicle)} disabled={isMutatingThis}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-medium transition-all">
                          <i className="bx bxs-trash text-sm" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals — all logic unchanged */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Vehicle to Inventory">
        <VehicleForm onSubmit={(data) => createMutation.mutate(data)} isSubmitting={createMutation.isPending} onCancel={() => setIsAddOpen(false)} />
      </Modal>

      <Modal isOpen={Boolean(editingVehicle)} onClose={() => setEditingVehicle(null)} title={editingVehicle ? `Edit ${editingVehicle.make} ${editingVehicle.model}` : 'Edit Vehicle'}>
        {editingVehicle && (
          <VehicleForm initialData={editingVehicle} onSubmit={(data) => updateMutation.mutate({ id: editingVehicle.id, data })} isSubmitting={updateMutation.isPending} onCancel={() => setEditingVehicle(null)} />
        )}
      </Modal>

      <ConfirmDialog isOpen={Boolean(saleVehicle)} onClose={() => setSaleVehicle(null)} onConfirm={() => purchaseMutation.mutate(saleVehicle.id)}
        title="Confirm Vehicle Sale"
        description={saleVehicle ? `Are you sure you want to record a sale for ${saleVehicle.make} ${saleVehicle.model}? This will immediately reduce inventory quantity by 1.` : ''}
        confirmText="Record Sale" variant="primary" isLoading={purchaseMutation.isPending} />

      <ConfirmDialog isOpen={Boolean(restockTarget)} onClose={() => setRestockTarget(null)} onConfirm={() => restockMutation.mutate({ id: restockTarget?.id, quantity: 1 })}
        title="Restock Vehicle"
        description={restockTarget ? `Increment inventory stock for ${restockTarget.make} ${restockTarget.model} by +1 unit?` : ''}
        confirmText="+1 Restock" variant="primary" isLoading={restockMutation.isPending} />

      <ConfirmDialog isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        title="Confirm Deletion"
        description={deleteTarget ? `Permanently delete ${deleteTarget.make} ${deleteTarget.model} from inventory? This action cannot be undone.` : ''}
        confirmText="Delete Vehicle" variant="danger" isLoading={deleteMutation.isPending} />
    </div>
  );
}

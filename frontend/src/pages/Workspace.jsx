import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit2,
  ShoppingCart,
  Trash2,
  RotateCcw,
  Car,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  purchaseVehicle,
  restockVehicle,
  deleteVehicle,
} from '../services/vehicleService';
import Modal from '../components/ui/Modal';
import VehicleForm from '../components/ui/VehicleForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function Workspace() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [saleVehicle, setSaleVehicle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restockTarget, setRestockTarget] = useState(null);

  const {
    data: vehicles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
    staleTime: 30 * 1000,
  });

  // 1. Create Vehicle Mutation
  const createMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: (newVehicle) => {
      queryClient.setQueryData(['vehicles'], (old = []) => [newVehicle, ...old]);
      toast.success(`${newVehicle.make} ${newVehicle.model} added to inventory`);
      setIsAddOpen(false);
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || 'Failed to add vehicle';
      toast.error(msg);
    },
  });

  // 2. Update Vehicle Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateVehicle(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['vehicles'], (old = []) =>
        old.map((v) => (v.id === updated.id ? updated : v))
      );
      toast.success(`${updated.make} ${updated.model} updated successfully`);
      setEditingVehicle(null);
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || 'Failed to update vehicle';
      toast.error(msg);
    },
  });

  // 3. Optimistic Record Sale Mutation
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
      const msg = err?.response?.data?.error || 'Failed to record sale';
      toast.error(msg);
    },
    onSuccess: (updated) => {
      toast.success(`Recorded sale for ${updated.make} ${updated.model}`);
      setSaleVehicle(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  // 4. Optimistic Delete Mutation (Admin only)
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteVehicle(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      const previousVehicles = queryClient.getQueryData(['vehicles']);

      queryClient.setQueryData(['vehicles'], (old = []) => old.filter((v) => v.id !== id));

      return { previousVehicles };
    },
    onError: (err, id, context) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(['vehicles'], context.previousVehicles);
      }
      toast.error('Failed to delete vehicle');
    },
    onSuccess: () => {
      toast.success('Vehicle deleted from inventory');
      setDeleteTarget(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  // 5. Optimistic Restock Mutation (Admin only)
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
      if (context?.previousVehicles) {
        queryClient.setQueryData(['vehicles'], context.previousVehicles);
      }
      toast.error('Failed to restock vehicle');
    },
    onSuccess: (updated) => {
      toast.success(`Restocked ${updated.make} ${updated.model}`);
      setRestockTarget(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  return (
    <div className="flex-1 flex flex-col bg-gray-950 min-h-0">
      {/* Workspace Header */}
      <div className="border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Inventory Workspace</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Dealership operational workspace ({user?.role || 'staff'})
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-gray-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        )}

        {isError && (
          <EmptyState
            icon={AlertCircle}
            title="Failed to load workspace inventory"
            description={error?.message || 'There was a problem fetching vehicles.'}
            action={
              <button
                onClick={() => refetch()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 text-sm font-semibold transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            }
          />
        )}

        {!isLoading && !isError && vehicles.length === 0 && (
          <EmptyState
            icon={Car}
            title="No vehicles in workspace"
            description="Get started by adding your dealership's first vehicle inventory entry."
            action={
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 text-sm font-semibold transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Vehicle
              </button>
            }
          />
        )}

        {!isLoading && !isError && vehicles.length > 0 && (
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800/80 shadow-xl shadow-black/30">
            {vehicles.map((vehicle) => {
              const inStock = vehicle.quantity > 0;
              const isMutatingThis =
                (purchaseMutation.isPending && purchaseMutation.variables === vehicle.id) ||
                (deleteMutation.isPending && deleteMutation.variables === vehicle.id);

              return (
                <div
                  key={vehicle.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-900/90 transition-colors"
                >
                  {/* Vehicle Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 font-bold text-lg">
                      {vehicle.make.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-base truncate">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                          {vehicle.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="font-semibold text-emerald-400">
                          ${vehicle.price.toLocaleString('en-US')}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                            inStock
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              : 'text-red-400 bg-red-500/10 border-red-500/20'
                          }`}
                        >
                          {inStock ? `${vehicle.quantity} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Action Controls */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* Edit Button */}
                    <button
                      onClick={() => setEditingVehicle(vehicle)}
                      disabled={isMutatingThis}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-white text-xs font-medium transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    {/* Record Sale Button */}
                    <button
                      onClick={() => setSaleVehicle(vehicle)}
                      disabled={!inStock || isMutatingThis}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Record Sale
                    </button>

                    {/* Restock Button (Admin Only) */}
                    {isAdmin && (
                      <button
                        onClick={() => setRestockTarget(vehicle)}
                        disabled={isMutatingThis}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 text-xs font-medium transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restock
                      </button>
                    )}

                    {/* Delete Button (Admin Only) */}
                    {isAdmin && (
                      <button
                        onClick={() => setDeleteTarget(vehicle)}
                        disabled={isMutatingThis}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-medium transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Vehicle to Inventory"
      >
        <VehicleForm
          onSubmit={(data) => createMutation.mutate(data)}
          isSubmitting={createMutation.isPending}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>

      {/* Edit Vehicle Modal */}
      <Modal
        isOpen={Boolean(editingVehicle)}
        onClose={() => setEditingVehicle(null)}
        title={
          editingVehicle
            ? `Edit ${editingVehicle.make} ${editingVehicle.model}`
            : 'Edit Vehicle'
        }
      >
        {editingVehicle && (
          <VehicleForm
            initialData={editingVehicle}
            onSubmit={(data) =>
              updateMutation.mutate({ id: editingVehicle.id, data })
            }
            isSubmitting={updateMutation.isPending}
            onCancel={() => setEditingVehicle(null)}
          />
        )}
      </Modal>

      {/* Record Sale Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(saleVehicle)}
        onClose={() => setSaleVehicle(null)}
        onConfirm={() => purchaseMutation.mutate(saleVehicle.id)}
        title="Confirm Vehicle Sale"
        description={
          saleVehicle
            ? `Are you sure you want to record a sale for ${saleVehicle.make} ${saleVehicle.model}? This will immediately reduce inventory quantity by 1.`
            : ''
        }
        confirmText="Record Sale"
        variant="primary"
        isLoading={purchaseMutation.isPending}
      />

      {/* Restock Confirmation/Prompt Modal (Admin Only) */}
      <ConfirmDialog
        isOpen={Boolean(restockTarget)}
        onClose={() => setRestockTarget(null)}
        onConfirm={() =>
          restockMutation.mutate({ id: restockTarget?.id, quantity: 1 })
        }
        title="Restock Vehicle"
        description={
          restockTarget
            ? `Increment inventory stock for ${restockTarget.make} ${restockTarget.model} by +1 unit?`
            : ''
        }
        confirmText="+1 Restock"
        variant="primary"
        isLoading={restockMutation.isPending}
      />

      {/* Delete Confirmation Dialog (Admin Only) */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        title="Confirm Deletion"
        description={
          deleteTarget
            ? `Permanently delete ${deleteTarget.make} ${deleteTarget.model} from inventory? This action cannot be undone.`
            : ''
        }
        confirmText="Delete Vehicle"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

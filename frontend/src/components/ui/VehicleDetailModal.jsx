import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  X, Car, Tag, DollarSign, Package, Calendar,
  ShoppingCart, RotateCcw, Trash2, Loader2, Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { purchaseVehicle, restockVehicle, deleteVehicle } from '../../services/vehicleService';
import toast from 'react-hot-toast';

const CATEGORY_ICONS = {
  SEDAN: '🚗', SUV: '🚙', HATCHBACK: '🚘', TRUCK: '🛻',
  SPORTS: '🏎️', LUXURY: '🏅', ELECTRIC: '⚡', HYBRID: '🌿',
};

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-800/60 last:border-0">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800/60 text-gray-400 shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-white truncate">{value}</p>
      </div>
    </div>
  );
}

export default function VehicleDetailModal({ vehicle, onClose }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [restockQty, setRestockQty] = useState(1);

  const isStaffOrAdmin = user?.role === 'admin' || user?.role === 'staff';
  const isAdmin = user?.role === 'admin';
  const inStock = vehicle.quantity > 0;

  const invalidateVehicles = () => {
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
  };

  const purchaseMutation = useMutation({
    mutationFn: () => purchaseVehicle(vehicle.id),
    onSuccess: () => {
      toast.success(`${vehicle.make} ${vehicle.model} purchased!`);
      invalidateVehicles();
      onClose();
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || 'Purchase failed. Please try again.';
      toast.error(msg);
    },
  });

  const restockMutation = useMutation({
    mutationFn: () => restockVehicle(vehicle.id, restockQty),
    onSuccess: () => {
      toast.success(`Restocked ${restockQty} unit(s)!`);
      invalidateVehicles();
      onClose();
    },
    onError: () => toast.error('Restock failed. Please try again.'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteVehicle(vehicle.id),
    onSuccess: () => {
      toast.success(`${vehicle.make} ${vehicle.model} deleted.`);
      invalidateVehicles();
      onClose();
    },
    onError: () => toast.error('Delete failed. Please try again.'),
  });

  const isAnyMutating =
    purchaseMutation.isPending || restockMutation.isPending || deleteMutation.isPending;

  const icon = CATEGORY_ICONS[vehicle.category] || '🚗';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Vehicle detail: ${vehicle.make} ${vehicle.model}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl shadow-black/60 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h2 className="text-base font-bold text-white">
                {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-xs text-gray-400">{vehicle.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {/* Price hero */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              ₹{vehicle.price.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-gray-400">Ex-Showroom INR</span>
            <span
              className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full border ${
                inStock
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-red-400 bg-red-500/10 border-red-500/20'
              }`}
            >
              {inStock ? `${vehicle.quantity} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Detail rows */}
          <div className="bg-gray-800/30 border border-gray-800 rounded-xl px-4">
            <DetailRow icon={Car} label="Make" value={vehicle.make} />
            <DetailRow icon={Tag} label="Model" value={vehicle.model} />
            <DetailRow icon={Shield} label="Category" value={vehicle.category} />
            <DetailRow
              icon={DollarSign}
              label="Price"
              value={`$${vehicle.price.toLocaleString('en-US')}`}
            />
            <DetailRow icon={Package} label="Stock Quantity" value={vehicle.quantity} />
            <DetailRow
              icon={Calendar}
              label="Added"
              value={new Date(vehicle.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            />
          </div>

          {/* Restock controls (admin only) */}
          {isAdmin && (
            <div className="mt-4 bg-gray-800/30 border border-gray-800 rounded-xl px-4 py-3">
              <p className="text-xs font-medium text-gray-400 mb-2">Restock quantity</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-sm text-white outline-none focus:border-emerald-500/50"
                  aria-label="Restock quantity"
                />
                <button
                  onClick={() => restockMutation.mutate()}
                  disabled={isAnyMutating || restockQty < 1}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {restockMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                  Restock
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center gap-3">
          <button
            onClick={() => {
              if (onPurchaseClick) {
                onPurchaseClick(vehicle);
              } else {
                purchaseMutation.mutate();
              }
            }}
            disabled={!inStock || isAnyMutating}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-gray-950 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-500/20"
          >
            {purchaseMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            {!inStock
              ? 'Out of Stock'
              : isStaffOrAdmin
              ? 'Record Sale'
              : 'Purchase'}
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                if (window.confirm(`Delete ${vehicle.make} ${vehicle.model}? This cannot be undone.`)) {
                  deleteMutation.mutate();
                }
              }}
              disabled={isAnyMutating}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

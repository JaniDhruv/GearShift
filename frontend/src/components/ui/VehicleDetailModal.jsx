import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { purchaseVehicle, restockVehicle, deleteVehicle } from '../../services/vehicleService';
import toast from 'react-hot-toast';

const CATEGORY_GRADIENTS = {
  SEDAN:    'from-blue-50 to-blue-100',
  SUV:      'from-violet-50 to-violet-100',
  HATCHBACK:'from-amber-50 to-amber-100',
  TRUCK:    'from-orange-50 to-orange-100',
  SPORTS:   'from-red-50 to-red-100',
  LUXURY:   'from-emerald-50 to-emerald-100',
  ELECTRIC: 'from-cyan-50 to-cyan-100',
  HYBRID:   'from-teal-50 to-teal-100',
};

const CATEGORY_BXICON = {
  SEDAN:    'bxs-car',
  SUV:      'bxs-car',
  HATCHBACK:'bxs-car',
  TRUCK:    'bxs-truck',
  SPORTS:   'bx-car',
  LUXURY:   'bxs-diamond',
  ELECTRIC: 'bxs-bolt-circle',
  HYBRID:   'bxs-leaf',
};

const CATEGORY_ICON_COLOR = {
  SEDAN:    'text-blue-400',
  SUV:      'text-violet-400',
  HATCHBACK:'text-amber-400',
  TRUCK:    'text-orange-400',
  SPORTS:   'text-red-400',
  LUXURY:   'text-emerald-400',
  ELECTRIC: 'text-cyan-400',
  HYBRID:   'text-teal-400',
};

function DetailRow({ iconClass, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-cream-100 last:border-0">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cream-100 border border-cream-200 text-ink-400 shrink-0">
        <i className={`bx ${iconClass} text-base`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm font-medium text-ink-900 truncate">{value}</p>
      </div>
    </div>
  );
}

export default function VehicleDetailModal({ vehicle, onClose, onPurchaseClick }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [restockQty, setRestockQty] = useState(1);

  const isStaffOrAdmin = user?.role === 'admin' || user?.role === 'staff';
  const isAdmin = user?.role === 'admin';
  const inStock = vehicle.quantity > 0;

  const invalidateVehicles = () => queryClient.invalidateQueries({ queryKey: ['vehicles'] });

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

  const gradient  = CATEGORY_GRADIENTS[vehicle.category] || CATEGORY_GRADIENTS.SEDAN;
  const bxIcon    = CATEGORY_BXICON[vehicle.category]    || 'bxs-car';
  const iconColor = CATEGORY_ICON_COLOR[vehicle.category]|| 'text-blue-400';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Vehicle detail: ${vehicle.make} ${vehicle.model}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white border border-cream-200 rounded-2xl shadow-card-lg flex flex-col max-h-[90vh] overflow-hidden">

        {/* Animated hero header */}
        <div className={`relative h-32 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors" />
          <i className={`bx ${bxIcon} text-[72px] ${iconColor} anim-float opacity-70`} />
          {/* Close button overlay */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 text-ink-500 hover:bg-white hover:text-ink-900 transition-colors"
            aria-label="Close"
          >
            <i className="bx bx-x text-xl" />
          </button>
          {/* Name overlay */}
          <div className="absolute bottom-3 left-4">
            <h2 className="text-base font-bold text-ink-900">{vehicle.make} {vehicle.model}</h2>
            <p className="text-xs text-ink-600">{vehicle.category}</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {/* Price hero */}
          <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 mb-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-ink-900">
              ₹{vehicle.price.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-ink-500">Ex-Showroom INR</span>
            <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full border ${
              inStock
                ? 'text-primary-700 bg-primary-50 border-primary-200'
                : 'text-red-600 bg-red-50 border-red-200'
            }`}>
              {inStock ? `${vehicle.quantity} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Detail rows */}
          <div className="bg-cream-50 border border-cream-200 rounded-xl px-4">
            <DetailRow iconClass="bxs-car"       label="Make"       value={vehicle.make} />
            <DetailRow iconClass="bx-tag"         label="Model"      value={vehicle.model} />
            <DetailRow iconClass="bxs-shield"     label="Category"   value={vehicle.category} />
            <DetailRow iconClass="bx-rupee"       label="Ex-Showroom Price" value={`₹${vehicle.price.toLocaleString('en-IN')}`} />
            <DetailRow iconClass="bxs-package"    label="Stock Quantity" value={vehicle.quantity} />
            <DetailRow
              iconClass="bx-calendar"
              label="Added"
              value={new Date(vehicle.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            />
          </div>

          {/* Restock controls (admin only) */}
          {isAdmin && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <p className="text-xs font-medium text-blue-600 mb-2">Restock quantity</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-sm text-ink-900 outline-none focus:border-primary-400"
                  aria-label="Restock quantity"
                />
                <button
                  onClick={() => restockMutation.mutate()}
                  disabled={isAnyMutating || restockQty < 1}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {restockMutation.isPending
                    ? <i className="bx bx-loader-alt text-base anim-spin-slow" />
                    : <i className="bx bx-revision text-base" />
                  }
                  Restock
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-cream-100 flex items-center gap-3">
          <button
            onClick={() => {
              if (onPurchaseClick) {
                onPurchaseClick(vehicle);
              } else {
                purchaseMutation.mutate();
              }
            }}
            disabled={!inStock || !user || isAnyMutating}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-primary-500/20"
          >
            {purchaseMutation.isPending
              ? <i className="bx bx-loader-alt text-base anim-spin-slow" />
              : !user && inStock
              ? <i className="bx bxs-lock-alt text-base" />
              : <i className="bx bxs-cart text-base" />
            }
            {!inStock
              ? 'Out of Stock'
              : !user
              ? 'Sign in to Purchase'
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
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {deleteMutation.isPending
                ? <i className="bx bx-loader-alt text-base anim-spin-slow" />
                : <i className="bx bxs-trash text-base" />
              }
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

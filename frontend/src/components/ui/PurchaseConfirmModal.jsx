import React from 'react';
import { ShoppingCart, Loader2, DollarSign, Package } from 'lucide-react';
import Modal from './Modal';

export default function PurchaseConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  vehicle,
  isStaffOrAdmin = false,
  isPending = false,
}) {
  if (!vehicle) return null;

  const actionLabel = isStaffOrAdmin ? 'Record Sale' : 'Purchase Vehicle';
  const confirmButtonText = isStaffOrAdmin ? 'Confirm Sale' : 'Confirm Purchase';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={actionLabel} maxWidth="max-w-md">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            {isStaffOrAdmin ? 'You are about to record a sale for' : 'You are about to purchase'}
          </p>
          <h3 className="text-lg font-bold text-white mt-1">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
            {vehicle.category}
          </span>
        </div>

        {/* Pricing & Stock Details Strip */}
        <div className="grid grid-cols-2 gap-3 bg-gray-950/60 border border-gray-800 rounded-xl p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Price</p>
              <p className="text-sm font-bold text-white">
                ${vehicle.price.toLocaleString('en-US')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Remaining Stock</p>
              <p className="text-sm font-bold text-white">{vehicle.quantity}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-800 text-sm font-medium text-gray-300 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-gray-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {confirmButtonText}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

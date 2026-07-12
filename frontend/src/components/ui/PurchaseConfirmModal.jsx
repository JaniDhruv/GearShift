import React from 'react';
import Modal from './Modal';

export default function PurchaseConfirmModal({
  isOpen, onClose, onConfirm, vehicle,
  isStaffOrAdmin = false, isPending = false,
}) {
  if (!vehicle) return null;

  const actionLabel = isStaffOrAdmin ? 'Record Sale' : 'Purchase Vehicle';
  const confirmButtonText = isStaffOrAdmin ? 'Confirm Sale' : 'Confirm Purchase';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={actionLabel} maxWidth="max-w-md">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs text-ink-400 font-medium uppercase tracking-wider">
            {isStaffOrAdmin ? 'You are about to record a sale for' : 'You are about to purchase'}
          </p>
          <h3 className="text-lg font-bold text-ink-900 mt-1">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-cream-100 text-ink-600 border border-cream-200">
            {vehicle.category}
          </span>
        </div>

        {/* Pricing & Stock Details Strip */}
        <div className="grid grid-cols-2 gap-3 bg-cream-50 border border-cream-200 rounded-xl p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 text-primary-600">
              <i className="bx bx-rupee text-base" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Ex-Showroom Price</p>
              <p className="text-sm font-bold text-ink-900">
                ₹{vehicle.price.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
              <i className="bx bxs-package text-base" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Remaining Stock</p>
              <p className="text-sm font-bold text-ink-900">{vehicle.quantity}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-xl border border-cream-200 hover:bg-cream-100 text-sm font-medium text-ink-600 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-sm shadow-primary-500/20"
          >
            {isPending ? (
              <>
                <i className="bx bx-loader-alt text-base anim-spin-slow" />
                Processing…
              </>
            ) : (
              <>
                <i className="bx bxs-cart text-base" />
                {confirmButtonText}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

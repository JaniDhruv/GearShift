import React from 'react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen, onClose, onConfirm, title, description,
  confirmText = 'Confirm', cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'primary'
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 border ${
            variant === 'danger'
              ? 'bg-red-50 border-red-200 text-red-500'
              : 'bg-primary-50 border-primary-200 text-primary-600'
          }`}>
            <i className="bx bxs-error text-xl" />
          </div>
          <div>
            <p className="text-sm text-ink-600 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-cream-200 hover:bg-cream-100 text-sm font-medium text-ink-600 transition-colors"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              variant === 'danger'
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                : 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/20'
            }`}
          >
            {isLoading && <i className="bx bx-loader-alt text-base anim-spin-slow" />}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

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

const CATEGORY_ACCENT = {
  SEDAN:    'border-l-blue-400',
  SUV:      'border-l-violet-400',
  HATCHBACK:'border-l-amber-400',
  TRUCK:    'border-l-orange-400',
  SPORTS:   'border-l-red-400',
  LUXURY:   'border-l-emerald-400',
  ELECTRIC: 'border-l-cyan-400',
  HYBRID:   'border-l-teal-400',
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

// BoxIcons names per category
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

const CATEGORY_TEXT_COLOR = {
  SEDAN:    'text-blue-600',
  SUV:      'text-violet-600',
  HATCHBACK:'text-amber-600',
  TRUCK:    'text-orange-600',
  SPORTS:   'text-red-600',
  LUXURY:   'text-emerald-600',
  ELECTRIC: 'text-cyan-600',
  HYBRID:   'text-teal-600',
};

export default function VehicleCard({ vehicle, onClick, onPurchaseClick }) {
  const { user } = useAuth();
  const isStaffOrAdmin = user?.role === 'staff' || user?.role === 'admin';

  const gradient  = CATEGORY_GRADIENTS[vehicle.category] || CATEGORY_GRADIENTS.SEDAN;
  const accent    = CATEGORY_ACCENT[vehicle.category]    || CATEGORY_ACCENT.SEDAN;
  const iconColor = CATEGORY_ICON_COLOR[vehicle.category]|| CATEGORY_ICON_COLOR.SEDAN;
  const bxIcon    = CATEGORY_BXICON[vehicle.category]    || 'bxs-car';
  const textColor = CATEGORY_TEXT_COLOR[vehicle.category]|| CATEGORY_TEXT_COLOR.SEDAN;
  const inStock   = vehicle.quantity > 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 3;

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (inStock && onPurchaseClick) onPurchaseClick(vehicle);
  };

  return (
    <article
      onClick={() => onClick?.(vehicle)}
      className={`group relative bg-white border border-cream-200 rounded-2xl shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer border-l-[3px] ${accent}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(vehicle)}
      aria-label={`View details for ${vehicle.make} ${vehicle.model}`}
    >
      {/* Gradient image area with animated icon */}
      <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
        {/* Subtle background shimmer on hover */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

        {/* Animated floating icon */}
        <i className={`bx ${bxIcon} text-[52px] ${iconColor} anim-float opacity-80`} />

        {/* Stock badge top-right */}
        <div className="absolute top-3 right-3">
          {!inStock ? (
            <span className="gs-badge bg-red-50 border-red-200 text-red-600">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="gs-badge bg-amber-50 border-amber-200 text-amber-700">
              Low — {vehicle.quantity} left
            </span>
          ) : (
            <span className="gs-badge bg-emerald-50 border-emerald-200 text-emerald-700">
              {vehicle.quantity} in stock
            </span>
          )}
        </div>

        {/* Category label top-left */}
        <div className="absolute top-3 left-3">
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${textColor}`}>
            {vehicle.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-semibold text-ink-900 text-[15px] leading-snug">
          {vehicle.make} {vehicle.model}
        </h3>

        {/* Price */}
        <div>
          <p className="text-xl font-bold text-ink-900 tracking-tight">
            ₹{vehicle.price.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-ink-400 mt-0.5">Ex-Showroom INR</p>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-3 border-t border-cream-100">
          <button
            type="button"
            onClick={handleActionClick}
            disabled={!inStock || !user}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all ${
              !inStock || !user
                ? 'bg-cream-100 border border-cream-200 text-ink-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white shadow-sm shadow-primary-500/20 anim-pulse-glow'
            }`}
          >
            {!user && inStock
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
        </div>
      </div>
    </article>
  );
}

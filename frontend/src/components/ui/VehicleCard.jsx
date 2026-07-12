import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORY_STYLES = {
  SEDAN:    { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-400' },
  SUV:      { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', dot: 'bg-purple-400' },
  HATCHBACK:{ color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-400' },
  TRUCK:    { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-400' },
  SPORTS:   { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
  LUXURY:   { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  ELECTRIC: { color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', dot: 'bg-cyan-400' },
  HYBRID:   { color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20', dot: 'bg-teal-400' },
};

const CATEGORY_ICONS = {
  SEDAN: '🚗', SUV: '🚙', HATCHBACK: '🚘', TRUCK: '🛻',
  SPORTS: '🏎️', LUXURY: '🏅', ELECTRIC: '⚡', HYBRID: '🌿',
};

export default function VehicleCard({ vehicle, onClick, onPurchaseClick }) {
  const { user } = useAuth();
  const isStaffOrAdmin = user?.role === 'staff' || user?.role === 'admin';

  const style = CATEGORY_STYLES[vehicle.category] || CATEGORY_STYLES.SEDAN;
  const icon = CATEGORY_ICONS[vehicle.category] || '🚗';
  const inStock = vehicle.quantity > 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 3;

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (inStock && onPurchaseClick) {
      onPurchaseClick(vehicle);
    }
  };

  return (
    <article
      onClick={() => onClick?.(vehicle)}
      className="group relative bg-gray-900/60 border border-gray-800 rounded-2xl p-5 cursor-pointer hover:border-gray-700 hover:bg-gray-900 hover:shadow-xl hover:shadow-black/30 transition-all duration-200 flex flex-col gap-4"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(vehicle)}
      aria-label={`View details for ${vehicle.make} ${vehicle.model}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-xl border ${style.bg}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium mt-0.5 ${style.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {vehicle.category}
            </span>
          </div>
        </div>

        {/* Urgency & Availability Badge */}
        {!inStock ? (
          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            <span>🔴</span> Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
            <span>🟡</span> Low Stock ({vehicle.quantity})
          </span>
        ) : (
          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span>🟢</span> In Stock ({vehicle.quantity})
          </span>
        )}
      </div>

      {/* Price */}
      <div>
        <p className="text-xl font-bold text-white tracking-tight">
          ₹{vehicle.price.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">Ex-Showroom INR</p>
      </div>

      {/* Primary Role-Aware Action Button */}
      <div className="mt-auto pt-2 border-t border-gray-800/80">
        <button
          type="button"
          onClick={handleActionClick}
          disabled={!inStock}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm ${
            !inStock
              ? 'bg-gray-800 border border-gray-700/60 text-gray-500 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-gray-950 shadow-emerald-500/20'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {!inStock
            ? 'Out of Stock'
            : isStaffOrAdmin
            ? 'Record Sale'
            : 'Purchase'}
        </button>
      </div>

      {/* Hover cue */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl pointer-events-none" />
    </article>
  );
}

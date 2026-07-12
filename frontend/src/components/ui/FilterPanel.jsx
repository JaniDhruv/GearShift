import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  'SEDAN', 'SUV', 'HATCHBACK', 'TRUCK', 'SPORTS', 'LUXURY', 'ELECTRIC', 'HYBRID',
];

const PRICE_PRESETS = [
  { label: 'All prices (INR)', minPrice: '', maxPrice: '' },
  { label: 'Under ₹10 Lakh', minPrice: '', maxPrice: '1000000' },
  { label: '₹10L – ₹20 Lakh', minPrice: '1000000', maxPrice: '2000000' },
  { label: '₹20L – ₹40 Lakh', minPrice: '2000000', maxPrice: '4000000' },
  { label: 'Over ₹40 Lakh', minPrice: '4000000', maxPrice: '' },
];

export default function FilterPanel({ filters, onChange, onReset }) {
  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice;

  const activePricePreset = PRICE_PRESETS.find(
    (p) => p.minPrice === (filters.minPrice || '') && p.maxPrice === (filters.maxPrice || '')
  );

  const setCategory = (cat) =>
    onChange({ ...filters, category: filters.category === cat ? '' : cat });

  const setPricePreset = (preset) =>
    onChange({ ...filters, minPrice: preset.minPrice, maxPrice: preset.maxPrice });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
      {/* Category chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <SlidersHorizontal className="w-4 h-4 text-gray-500 shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`filter-category-${cat.toLowerCase()}`}
            onClick={() => setCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              filters.category === cat
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-300 bg-gray-900/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Price preset select */}
      <select
        id="filter-price"
        value={activePricePreset ? `${filters.minPrice}|${filters.maxPrice}` : ''}
        onChange={(e) => {
          const [min, max] = e.target.value.split('|');
          setPricePreset({ minPrice: min, maxPrice: max });
        }}
        className="px-3 py-1.5 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-gray-300 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        aria-label="Filter by price range"
      >
        {PRICE_PRESETS.map((p) => (
          <option key={p.label} value={`${p.minPrice}|${p.maxPrice}`}>
            {p.label}
          </option>
        ))}
      </select>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all"
        >
          <X className="w-3.5 h-3.5" />
          Clear filters
        </button>
      )}
    </div>
  );
}

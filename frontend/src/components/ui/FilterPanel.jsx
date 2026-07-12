import React from 'react';

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
        <i className="bx bxs-slider text-sm text-ink-400 shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`filter-category-${cat.toLowerCase()}`}
            onClick={() => setCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              filters.category === cat
                ? 'bg-primary-500 border-primary-500 text-white shadow-sm'
                : 'border-cream-300 text-ink-500 hover:border-ink-300 hover:text-ink-800 bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Price select */}
      <select
        id="filter-price"
        value={activePricePreset ? `${filters.minPrice}|${filters.maxPrice}` : ''}
        onChange={(e) => {
          const [min, max] = e.target.value.split('|');
          setPricePreset({ minPrice: min, maxPrice: max });
        }}
        className="px-3 py-1.5 rounded-xl bg-white border border-cream-300 text-xs text-ink-600 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 transition-all shadow-card"
        aria-label="Filter by price range"
      >
        {PRICE_PRESETS.map((p) => (
          <option key={p.label} value={`${p.minPrice}|${p.maxPrice}`}>{p.label}</option>
        ))}
      </select>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-all"
        >
          <i className="bx bx-x text-sm" />
          Clear filters
        </button>
      )}
    </div>
  );
}

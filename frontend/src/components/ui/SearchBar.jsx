import React from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search by make or model…' }) {
  return (
    <div className="relative flex-1 min-w-0">
      <i className="bx bx-search absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-ink-400 pointer-events-none" />
      <input
        id="inventory-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search inventory"
        className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-cream-200 text-sm text-ink-900 placeholder-ink-400 outline-none shadow-card transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors"
          aria-label="Clear search"
        >
          <i className="bx bx-x text-lg" />
        </button>
      )}
    </div>
  );
}

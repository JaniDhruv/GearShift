import React from 'react';

/**
 * Reusable SelectField component for form select inputs with consistent styling and error display.
 */
export default function SelectField({
  id,
  label,
  options = [],
  registration, // from react-hook-form register()
  error,
  icon: Icon,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        )}
        <select
          id={id}
          {...registration}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full ${
            Icon ? 'pl-10' : 'pl-4'
          } pr-10 py-2.5 rounded-xl bg-gray-800/60 border text-sm text-white outline-none transition-all focus:ring-2 ${
            error
              ? 'border-red-500/60 focus:ring-red-500/30'
              : 'border-gray-700 focus:border-emerald-500/60 focus:ring-emerald-500/20'
          }`}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-gray-900 text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
        >
          <span>⚠</span>
          {error.message}
        </p>
      )}
    </div>
  );
}

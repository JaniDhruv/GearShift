import React from 'react';

/**
 * Reusable SelectField component for form select inputs with consistent light theme and error display.
 */
export default function SelectField({
  id,
  label,
  options = [],
  registration,
  error,
  iconClass,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {iconClass && (
          <i className={`bx ${iconClass} absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-ink-400 pointer-events-none`} />
        )}
        <select
          id={id}
          {...registration}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full ${
            iconClass ? 'pl-10' : 'pl-4'
          } pr-10 py-2.5 rounded-xl bg-white border text-sm text-ink-900 outline-none transition-all focus:ring-2 ${
            error
              ? 'border-red-400 focus:ring-red-400/20'
              : 'border-cream-200 focus:border-primary-400 focus:ring-primary-500/15'
          }`}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-white text-ink-900"
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
          className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
        >
          <i className="bx bxs-error-circle text-sm" />
          {error.message}
        </p>
      )}
    </div>
  );
}

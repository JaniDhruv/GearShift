import React from 'react';

/**
 * Reusable FormField component for consistent input styling and accessibility.
 * Wraps a label, icon-adornment input, and error message in a cohesive unit.
 */
export default function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  registration, // from react-hook-form register()
  error,
  icon: Icon,
  rightElement,
  autoComplete,
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
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          {...registration}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${rightElement ? 'pr-10' : 'pr-4'} py-2.5 rounded-xl bg-gray-800/60 border text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 ${
            error
              ? 'border-red-500/60 focus:ring-red-500/30'
              : 'border-gray-700 focus:border-emerald-500/60 focus:ring-emerald-500/20'
          }`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <span>⚠</span>
          {error.message}
        </p>
      )}
    </div>
  );
}

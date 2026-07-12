import React from 'react';

/**
 * Reusable FormField — now accepts `iconClass` (BoxIcons string) instead of a Lucide component.
 * Original validation registration/error logic unchanged.
 */
export default function FormField({
  id, label, type = 'text', placeholder,
  registration, error, iconClass, rightElement, autoComplete,
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
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          {...registration}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full ${iconClass ? 'pl-10' : 'pl-4'} ${rightElement ? 'pr-10' : 'pr-4'} py-2.5 rounded-xl bg-white border text-sm text-ink-900 placeholder-ink-400 outline-none transition-all focus:ring-2 ${
            error
              ? 'border-red-400 focus:ring-red-400/20'
              : 'border-cream-200 focus:border-primary-400 focus:ring-primary-500/15'
          }`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <i className="bx bxs-error-circle text-sm" />
          {error.message}
        </p>
      )}
    </div>
  );
}

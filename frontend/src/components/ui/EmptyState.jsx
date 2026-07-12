import React from 'react';

export default function EmptyState({ title, description, iconClass, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center anim-fade-up">
      {iconClass && (
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-cream-100 border border-cream-200 text-ink-400 mb-5">
          <i className={`bx ${iconClass} text-3xl`} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-ink-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-ink-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

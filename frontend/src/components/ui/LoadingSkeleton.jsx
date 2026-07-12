import React from 'react';

function SkeletonCard() {
  return (
    <div className="bg-white border border-cream-200 rounded-2xl shadow-card overflow-hidden">
      <div className="h-36 anim-shimmer" />
      <div className="p-4 flex flex-col gap-3">
        <div className="space-y-2">
          <div className="h-3.5 w-32 rounded-full anim-shimmer" />
          <div className="h-2.5 w-20 rounded-full anim-shimmer" />
        </div>
        <div className="space-y-1.5">
          <div className="h-5 w-28 rounded anim-shimmer" />
          <div className="h-2.5 w-16 rounded anim-shimmer" />
        </div>
        <div className="mt-1 pt-3 border-t border-cream-100">
          <div className="h-9 rounded-xl anim-shimmer" />
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

import React from 'react';

/** Single card-shaped skeleton pulse */
function SkeletonCard() {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-800" />
          <div className="space-y-2">
            <div className="h-3.5 w-28 rounded bg-gray-800" />
            <div className="h-2.5 w-16 rounded bg-gray-800" />
          </div>
        </div>
        <div className="h-5 w-20 rounded-full bg-gray-800" />
      </div>
      <div className="space-y-1.5 mt-auto">
        <div className="h-5 w-24 rounded bg-gray-800" />
        <div className="h-2.5 w-10 rounded bg-gray-800" />
      </div>
    </div>
  );
}

/** Grid of skeleton cards while loading */
export default function LoadingSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

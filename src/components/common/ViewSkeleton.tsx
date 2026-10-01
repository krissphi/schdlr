import React from 'react';

export const ViewSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-lg" />
          <div className="h-3.5 w-72 bg-slate-100 rounded" />
        </div>
        <div className="h-9 w-32 bg-slate-200 rounded-lg" />
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-3 shadow-subtle">
            <div className="h-3 w-24 bg-slate-100 rounded" />
            <div className="h-7 w-16 bg-slate-200 rounded" />
            <div className="h-2.5 w-32 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Main Content Area skeleton */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4 shadow-subtle">
        <div className="h-4 w-36 bg-slate-200 rounded" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-48 bg-slate-200 rounded" />
                <div className="h-2.5 w-24 bg-slate-100 rounded" />
              </div>
              <div className="h-6 w-16 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

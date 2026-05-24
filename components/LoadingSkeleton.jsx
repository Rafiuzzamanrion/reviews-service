"use client";

export function ProductCardSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-5 bg-primary/10 rounded-lg w-2/3" />
        <div className="h-5 bg-accent/10 rounded-full w-20" />
      </div>
      <div className="h-9 bg-accent/10 rounded-lg w-24 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-warning/10 rounded-full w-24" />
        <div className="h-6 bg-orange-100 rounded-full w-20" />
      </div>
      <div className="space-y-3 border-t border-white/40 pt-4 mb-6">
        <div className="h-4 bg-primary/5 rounded w-full" />
        <div className="h-4 bg-primary/5 rounded w-4/5" />
        <div className="h-4 bg-primary/5 rounded w-3/5" />
      </div>
      <div className="h-12 bg-primary/10 rounded-xl" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 7 }) {
  return (
    <tr className="border-b border-white/20">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-primary/10 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function FormSkeleton() {
  return (
    <div className="glass-card p-8 animate-pulse space-y-6">
      <div className="h-6 bg-primary/10 rounded-lg w-1/3" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-primary/8 rounded w-1/4" />
          <div className="h-11 bg-primary/5 rounded-xl" />
        </div>
      ))}
      <div className="h-12 bg-primary/10 rounded-xl w-full" />
    </div>
  );
}

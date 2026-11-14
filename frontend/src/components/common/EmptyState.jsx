import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ title = 'No records found', description = 'There are no active items to display.' }) {
  return (
    <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-2">
      <PackageOpen className="w-8 h-8 text-slate-400 mx-auto" />
      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{title}</h4>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{description}</p>
    </div>
  );
}

import React from 'react';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function ShipmentStatusBadge({ status }) {
  if (status === 'IN_TRANSIT') {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 inline-flex items-center gap-1">
        <Clock className="w-3 h-3" />
        IN_TRANSIT
      </span>
    );
  }
  if (status === 'CUSTOMS_HOLD') {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 inline-flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        CUSTOMS_HOLD
      </span>
    );
  }
  if (status === 'EXCURSION_ALERT') {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 inline-flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        EXCURSION_ALERT
      </span>
    );
  }
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 inline-flex items-center gap-1">
      <CheckCircle2 className="w-3 h-3" />
      {status || 'DELIVERED'}
    </span>
  );
}

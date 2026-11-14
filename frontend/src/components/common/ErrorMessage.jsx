import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message = 'An error occurred while loading data.' }) {
  return (
    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 flex items-center gap-3 text-xs text-rose-700 dark:text-rose-400">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

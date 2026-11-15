import React from 'react';
import { RotateCw } from 'lucide-react';

export default function LoadingSpinner({ label = 'Verifying cryptographic blocks...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <RotateCw className="w-6 h-6 text-cyan-600 dark:text-cyan-400 animate-spin" />
      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{label}</span>
    </div>
  );
}

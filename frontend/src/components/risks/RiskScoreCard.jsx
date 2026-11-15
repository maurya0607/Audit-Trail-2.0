import React from 'react';
import { AlertTriangle } from 'lucide-react';
import RiskSeverityBadge from './RiskSeverityBadge';

export default function RiskScoreCard({ title, score, category, details }) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-500" /> {title}
        </span>
        <RiskSeverityBadge score={score} />
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300">{details}</p>
      <div className="text-[10px] text-slate-400 font-mono">Category: {category}</div>
    </div>
  );
}

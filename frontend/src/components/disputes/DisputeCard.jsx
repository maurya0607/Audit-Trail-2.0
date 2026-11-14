import React from 'react';
import { Scale, FileText } from 'lucide-react';

export default function DisputeCard({ dispute, onSelect, isSelected }) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-500/50 shadow-sm'
          : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400">{dispute.id}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
          {dispute.status}
        </span>
      </div>
      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{dispute.title}</h4>
      <div className="text-[11px] text-slate-500 font-mono mt-1">Amount: {dispute.disputedAmount}</div>
    </div>
  );
}

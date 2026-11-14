import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

export default function DecisionPanel({ onDecide, isDeciding, decision }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Manager Final Decision Panel</h4>
        {decision && <span className="text-xs font-bold text-emerald-600 font-mono">Recorded: {decision}</span>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onDecide('CONFIRM_TRANSPORTER_LIABLE')}
          disabled={isDeciding}
          className="py-1.5 px-3 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow-xs"
        >
          Confirm Transporter Liability (100%)
        </button>
        <button
          onClick={() => onDecide('SPLIT_LIABILITY_50_50')}
          disabled={isDeciding}
          className="py-1.5 px-3 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        >
          Split 50/50 Liability
        </button>
      </div>
    </div>
  );
}

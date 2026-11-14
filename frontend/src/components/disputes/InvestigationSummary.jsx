import React from 'react';
import { Sparkles, ShieldAlert } from 'lucide-react';

export default function InvestigationSummary({ investigation }) {
  if (!investigation) return null;

  return (
    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/30 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <h4 className="text-xs font-bold text-purple-950 dark:text-purple-300">Gemini AI Investigation Summary</h4>
      </div>
      <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
        <div><strong>Mismatch:</strong> {investigation.quantityMismatch}</div>
        <div><strong>Timeline Conflict:</strong> {investigation.timestampConflict}</div>
        <div><strong>Ledger Proof:</strong> <span className="font-mono text-cyan-600">{investigation.ledgerCorrelation}</span></div>
      </div>
      <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-xs font-bold text-purple-900 dark:text-purple-200">
        Verdict Advice: {investigation.liabilityAttribution}
      </div>
    </div>
  );
}

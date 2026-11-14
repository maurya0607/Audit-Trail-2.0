import React, { useState } from 'react';
import { Scale, CheckCircle2, ShieldAlert, FileText, Check, ShieldCheck } from 'lucide-react';

export default function DisputeDesk() {
  const [selectedDispute, setSelectedDispute] = useState(0);

  const disputes = [
    {
      id: 'DSP-2026-081',
      shipmentId: 'SHP-77103-LAX',
      claimant: 'FreshMart Organics LLC',
      respondent: 'NorthStar Intermodal Logistics',
      claimType: 'Perishable Produce Spoilage Claim',
      claimAmount: '$24,500.00 USD',
      filedAt: '2026-11-14 16:30 UTC',
      status: 'AUTO_RESOLVED',
      verdict: 'Carrier Liable (100%)',
      verdictSummary:
        'Cryptographic audit ledger Block #5 recorded refrigeration compressor off-state for 3 hours 12 minutes while in NorthStar physical custody.',
      auditProofHash: '9a8f10bc39104fa2891cd01948ba',
    },
    {
      id: 'DSP-2026-074',
      shipmentId: 'SHP-90412-SGP',
      claimant: 'Apex Global Tech',
      respondent: 'Pacific Freight Express',
      claimType: 'Demurrage & Customs Delay Penalty',
      claimAmount: '$6,200.00 USD',
      filedAt: '2026-11-13 11:20 UTC',
      status: 'IN_REVIEW',
      verdict: 'Pending Final Verification',
      verdictSummary:
        'Audit trail verifies customs seal was inspected at port terminal. Port authority documentation undergoing hash comparison.',
      auditProofHash: '3b01984ca90124b8109cf819024a',
    },
  ];

  const active = disputes[selectedDispute];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Evidence-Based Dispute Resolution
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated liability determination backed by immutable audit ledger proofs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claims Ledger Column */}
        <div className="space-y-3 lg:col-span-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Arbitration Dockets
          </span>
          {disputes.map((d, idx) => (
            <div
              key={d.id}
              onClick={() => setSelectedDispute(idx)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedDispute === idx
                  ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-500/50 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400">
                  {d.id}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    d.status === 'AUTO_RESOLVED'
                      ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                      : 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                  }`}
                >
                  {d.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {d.claimType}
              </h4>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                Amount: {d.claimAmount}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Claim Docket Details */}
        <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 gap-2">
            <div>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                Case File: {active.id}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {active.claimType}
              </h3>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Disputed Settlement</span>
              <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                {active.claimAmount}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5 text-[11px]">
                Claimant (Consignee)
              </span>
              <span className="text-slate-900 dark:text-white font-semibold">
                {active.claimant}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5 text-[11px]">
                Respondent (Carrier)
              </span>
              <span className="text-slate-900 dark:text-white font-semibold">
                {active.respondent}
              </span>
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/30 rounded-xl mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldAlert className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
                Audit Trail Verdict: {active.verdict}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {active.verdictSummary}
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900/90 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Cryptographic Proof:</span>
              <span className="text-cyan-700 dark:text-cyan-300 truncate font-semibold">
                {active.auditProofHash}
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-500/30 self-start sm:self-auto uppercase tracking-wider">
              Non-Repudiable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

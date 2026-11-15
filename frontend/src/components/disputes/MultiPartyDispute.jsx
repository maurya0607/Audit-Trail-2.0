import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth, ROLES } from '../../context/AuthContext';
import {
  Scale,
  ShieldAlert,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  Building2,
  Check,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export default function MultiPartyDispute() {
  const { user } = useAuth();

  const [activeDisputeIndex, setActiveDisputeIndex] = useState(0);
  const [managerVerdict, setManagerVerdict] = useState(null);
  const [isDeciding, setIsDeciding] = useState(false);

  const disputes = [
    {
      id: 'DSP-2026-081',
      shipmentId: 'SHP-77103-LAX',
      title: 'Perishable Produce Spoilage & Quantity Shortage Claim',
      disputedAmount: '$24,500.00 USD',
      filedAt: '2026-11-14 16:30 UTC',
      status: managerVerdict ? 'MANAGER_SETTLED' : 'AI_RECOMMENDED',
      claims: {
        supplier: {
          party: 'FreshMart Organics LLC',
          role: 'Supplier / Consignor',
          claimedQuantity: '100 Boxes (1,800 kg)',
          condition: 'Pre-cooled to 3.8°C at dispatch dock',
          evidenceRef: 'INV-2026-902 & PACK-LIST-441',
          statement: 'Full 100 boxes loaded into refrigerated trailer with seal intact.',
        },
        transporter: {
          party: 'NorthStar Intermodal Logistics',
          role: 'Transporter / Carrier',
          claimedQuantity: '100 Boxes picked up',
          condition: 'Reefer setpoint at 4.0°C; reported minor engine delay',
          evidenceRef: 'BOL-88219 & TRANSIT-TELEMETRY-LOG',
          statement: 'Picked up 100 units. Compressor encountered transient electrical fault.',
        },
        receiver: {
          party: 'PrimeGrocers Distribution LAX',
          role: 'Receiver / Consignee',
          claimedQuantity: '92 Boxes received (8 missing)',
          condition: 'Thermal probe showed 14.2°C; 2 boxes spoiled',
          evidenceRef: 'DELIVERY-RECEIPT-881 & LOSS-PHOTO-01',
          statement: 'Physical count verified 92 units upon arrival. 8 boxes missing and severe temperature violation.',
        },
      },
      aiInvestigation: {
        confidenceScore: '96.4%',
        primaryFinding: 'Refrigeration compressor failure of 3 hours 12 minutes occurred between Sonora and Mexicali.',
        missingQuantityRootCause: 'Weight sensors show 8-box tare drop during unscheduled stop at Mexicali rest stop (Block #3).',
        recommendedSettlement: 'Transporter holds 100% liability for 8 lost boxes and thermal spoilage damages.',
        recommendedAllocation: {
          supplierPayable: '$0.00 (Cleared)',
          transporterLiability: '$24,500.00 (Carrier Insurance Claim)',
          receiverCompensation: '$24,500.00 (Credit)',
        },
      },
    },
  ];

  const current = disputes[activeDisputeIndex];

  const handleManagerDecision = (verdict) => {
    setIsDeciding(true);
    setTimeout(() => {
      setManagerVerdict(verdict);
      setIsDeciding(false);
      toast.success(
        verdict === 'APPROVE_AI_ADVICE'
          ? 'Manager Verdict executed: $24.5K liability assigned to Transporter'
          : `Manager Verdict executed: ${verdict}`,
        {
          icon: '⚖️',
          duration: 5000,
        }
      );
    }, 500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Multi-Party Dispute & AI Investigation Desk
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tripartite claims reconciliation: Supplier &bull; Transporter &bull; Receiver
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            Dispute #{current.id}
          </span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            {current.status}
          </span>
        </div>
      </div>

      {/* Tripartite Claim Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Supplier */}
        <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
              Supplier Claim
            </span>
            <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">100 Boxes</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{current.claims.supplier.party}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{current.claims.supplier.statement}</p>
          </div>
          <div className="text-[11px] pt-2 border-t border-cyan-200/60 dark:border-cyan-500/20 text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Evidence:</span> {current.claims.supplier.evidenceRef}
          </div>
        </div>

        {/* Transporter */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
              Transporter Claim
            </span>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">100 Picked Up</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{current.claims.transporter.party}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{current.claims.transporter.statement}</p>
          </div>
          <div className="text-[11px] pt-2 border-t border-indigo-200/60 dark:border-indigo-500/20 text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Evidence:</span> {current.claims.transporter.evidenceRef}
          </div>
        </div>

        {/* Receiver */}
        <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 dark:text-rose-300">
              Receiver Claim
            </span>
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">92 Received (-8)</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{current.claims.receiver.party}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{current.claims.receiver.statement}</p>
          </div>
          <div className="text-[11px] pt-2 border-t border-rose-200/60 dark:border-rose-500/20 text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Evidence:</span> {current.claims.receiver.evidenceRef}
          </div>
        </div>
      </div>

      {/* AI Autonomous Synthesis Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-200 dark:border-indigo-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
              Autonomous AI Telemetry Audit Synthesis
            </h4>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono">
            Confidence: {current.aiInvestigation.confidenceScore}
          </span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {current.aiInvestigation.primaryFinding} {current.aiInvestigation.missingQuantityRootCause}
        </p>

        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            AI Advisory: {current.aiInvestigation.recommendedSettlement}
          </span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            Disputed Value: {current.disputedAmount}
          </span>
        </div>
      </div>

      {/* Logistics Manager Final Verdict Panel */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Final Decision Authority (Human Manager Sign-off)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Per Section 2 Module 6: Human manager maintains final approval over AI recommendations.
            </p>
          </div>
          {managerVerdict && (
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verdict Executed: {managerVerdict}</span>
            </span>
          )}
        </div>

        {!managerVerdict ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleManagerDecision('APPROVE_AI_ADVICE')}
              disabled={isDeciding}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Adopt AI Settlement ($24.5K Transporter Liability)</span>
            </button>
            <button
              onClick={() => handleManagerDecision('SPLIT_LIABILITY_50_50')}
              disabled={isDeciding}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all"
            >
              Split 50/50 Carrier-Supplier
            </button>
            <button
              onClick={() => handleManagerDecision('ESCALATE_AUDITOR')}
              disabled={isDeciding}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all"
            >
              Escalate to External Regulatory Auditor
            </button>
          </div>
        ) : (
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Decision cryptographically anchored to ledger with session signature. Parties notified via webhook.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export { MultiPartyDispute as ClaimComparison };

import React, { useState } from 'react';
import { ShieldCheck, Link2, AlertTriangle, CheckCircle2, RotateCw, Copy, Check } from 'lucide-react';

export default function AuditLedger() {
  const [tampered, setTampered] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const initialBlocks = [
    {
      index: 0,
      timestamp: '2026-11-14T08:15:22Z',
      eventType: 'GENESIS_DISPATCH',
      location: 'Basel Bio Logistics Hub',
      custodian: 'Novartis Pharma AG',
      payloadHash: 'a718c29038ba9812e81a',
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      hash: '9d4f8e12a819b48c1092a01347890bcaf89211d0831a482b8f9e018a38217f2a',
    },
    {
      index: 1,
      timestamp: '2026-11-14T11:42:09Z',
      eventType: 'CUSTODY_TRANSFER',
      location: 'Zurich Airport Cargo Bay 4',
      custodian: 'Swiss WorldCargo AG',
      payloadHash: 'b519082348ba091119a4',
      prevHash: '9d4f8e12a819b48c1092a01347890bcaf89211d0831a482b8f9e018a38217f2a',
      hash: '148fa721094ba98d1024bc0192e47291a81239ab748190cefab418934102948a',
    },
    {
      index: 2,
      timestamp: '2026-11-14T14:30:00Z',
      eventType: 'COLD_CHAIN_TELEMETRY',
      location: 'In-Flight Flight LX108 (38,000 ft)',
      custodian: 'Swiss WorldCargo AG',
      payloadHash: 'c9012489104ba902aa72',
      prevHash: '148fa721094ba98d1024bc0192e47291a81239ab748190cefab418934102948a',
      hash: '57b91048ca091248db0192487af01924ba918234acfe09182390841289410298',
    },
    {
      index: 3,
      timestamp: '2026-11-14T17:05:44Z',
      eventType: 'CHECKPOINT_CUSTOMS',
      location: 'Dubai International DWC Hub',
      custodian: 'Emirates SkyCargo Ground',
      payloadHash: 'f4820194098234ab881c',
      prevHash: '57b91048ca091248db0192487af01924ba918234acfe09182390841289410298',
      hash: 'a012948cbfa0918234b01982734bca091823471029348ba09182347b0192834b',
    },
  ];

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (tampered) {
        setVerificationResult({
          valid: false,
          errorIndex: 2,
          message: 'CRITICAL AUDIT EXCEPTION: Hash mismatch detected at Block #2! Payload was mutated post-signature.',
        });
      } else {
        setVerificationResult({
          valid: true,
          message: 'AUDIT PASSED: All 4 cryptographic blocks verified with 100% SHA-256 chain continuity.',
        });
      }
    }, 600);
  };

  const handleToggleTamper = () => {
    setTampered(!tampered);
    setVerificationResult(null);
  };

  const copyHash = (hash, idx) => {
    navigator.clipboard.writeText(hash);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Tamper-Evident Event Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immutable SHA-256 linked blocks for Shipment <span className="font-mono text-cyan-700 dark:text-cyan-400 font-semibold">SHP-88219-DXB</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleTamper}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              tampered
                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/50'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tampered ? 'Revert Tamper' : 'Simulate Tamper at Block #2'}
          </button>

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 transition-all"
          >
            <RotateCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            <span>Verify Chain</span>
          </button>
        </div>
      </div>

      {verificationResult && (
        <div
          className={`p-4 rounded-xl mb-6 border text-xs font-semibold flex items-center gap-3 ${
            verificationResult.valid
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300'
          }`}
        >
          {verificationResult.valid ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{verificationResult.message}</span>
        </div>
      )}

      <div className="space-y-3">
        {initialBlocks.map((b, idx) => {
          const isTargetTampered = tampered && idx === 2;
          return (
            <div
              key={b.index}
              className={`p-4 rounded-xl border transition-all ${
                isTargetTampered
                  ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/50'
                  : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Block #{b.index}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {b.eventType}
                  </span>
                  {isTargetTampered && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30 font-bold uppercase tracking-wider animate-pulse">
                      Mutated Payload
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {b.timestamp}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3">
                <div>
                  Custodian: <span className="text-slate-900 dark:text-slate-200 font-medium">{b.custodian}</span>
                </div>
                <div>
                  Location: <span className="text-slate-900 dark:text-slate-200 font-medium">{b.location}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/90 rounded-lg p-3 font-mono text-[11px] space-y-1.5 border border-slate-200 dark:border-slate-800/80">
                <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Link2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span className="shrink-0 font-medium">Prev Hash:</span>
                  <span className="truncate text-slate-600 dark:text-slate-400">{b.prevHash}</span>
                </div>
                <div className="text-cyan-700 dark:text-cyan-400 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="shrink-0 font-semibold text-slate-700 dark:text-cyan-300">
                      Block Hash:
                    </span>
                    <span className="truncate font-bold">
                      {isTargetTampered
                        ? 'e9821a004bca99214781c81... [INVALID HASH]'
                        : b.hash}
                    </span>
                  </div>
                  <button
                    onClick={() => copyHash(b.hash, idx)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
                    title="Copy full hash"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

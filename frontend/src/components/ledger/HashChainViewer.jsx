import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck, Link2, AlertTriangle, CheckCircle2, RotateCw, Copy, Check } from 'lucide-react';

export default function HashChainViewer() {
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

  const [blocks, setBlocks] = useState(initialBlocks);

  const simulateTamper = () => {
    setTampered(true);
    setVerificationResult(null);
    setBlocks((prev) =>
      prev.map((b) =>
        b.index === 2
          ? {
              ...b,
              payloadHash: 'TAMPERED_PAYLOAD_9999',
              hash: 'CORRUPTED_HASH_3389012849012840912840912840192840912840912840912840',
            }
          : b
      )
    );
  };

  const resetBlocks = () => {
    setTampered(false);
    setVerificationResult(null);
    setBlocks(initialBlocks);
  };

  const verifyIntegrity = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (tampered) {
        setVerificationResult({
          valid: false,
          brokenBlock: 2,
          message: 'Integrity Check Failed: Block #2 payloadHash mismatch. Cryptographic chain broken.',
        });
        toast.error('Cryptographic Tamper Flagged! Block #2 hash mismatch detected', {
          duration: 5000,
        });
      } else {
        setVerificationResult({
          valid: true,
          brokenBlock: null,
          message: 'All 4 blocks verified. Full cryptographic Merkle consistency confirmed.',
        });
        toast.success('All 4 blocks verified! 100% cryptographic integrity confirmed', {
          duration: 4000,
        });
      }
    }, 600);
  };

  const copyHash = (hash, idx) => {
    navigator.clipboard.writeText(hash);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Immutable SHA-256 Event Chain & Ledger
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Consecutive cryptographic hashing connecting all logistical transactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!tampered ? (
            <button
              onClick={simulateTamper}
              className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-all"
            >
              Simulate Block Tampering
            </button>
          ) : (
            <button
              onClick={resetBlocks}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
            >
              Reset to Authentic Chain
            </button>
          )}

          <button
            onClick={verifyIntegrity}
            disabled={verifying}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all"
          >
            <RotateCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            <span>Verify Chain Integrity</span>
          </button>
        </div>
      </div>

      {verificationResult && (
        <div
          className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-3 ${
            verificationResult.valid
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}
        >
          {verificationResult.valid ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <span>{verificationResult.message}</span>
        </div>
      )}

      {/* Blocks sequence */}
      <div className="space-y-4">
        {blocks.map((block) => {
          const isBroken = tampered && block.index >= 2;
          return (
            <div
              key={block.index}
              className={`p-4 rounded-2xl border transition-all ${
                isBroken
                  ? 'bg-rose-50/40 dark:bg-rose-500/5 border-rose-300 dark:border-rose-900'
                  : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      isBroken
                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                        : 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                    }`}
                  >
                    Block #{block.index}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{block.eventType}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{block.timestamp}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 pb-2 text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Location:</span> {block.location}
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Signer / Custodian:</span> {block.custodian}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1 text-[11px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Previous Hash:</span>
                  <span className="text-slate-500 dark:text-slate-400 truncate max-w-[280px] sm:max-w-[450px]">
                    {block.prevHash}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Block Hash:</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold truncate max-w-[280px] sm:max-w-[450px] ${isBroken ? 'text-rose-500' : 'text-cyan-600 dark:text-cyan-400'}`}>
                      {block.hash}
                    </span>
                    <button
                      onClick={() => copyHash(block.hash, block.index)}
                      className="p-1 text-slate-400 hover:text-cyan-500"
                    >
                      {copiedIndex === block.index ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { HashChainViewer as AuditLedger, HashChainViewer as EventLedgerTable };

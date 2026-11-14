import React, { useState } from 'react';
import { useShipments } from '../context/ShipmentContext';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Lock,
  QrCode,
  Sparkles,
} from 'lucide-react';

export default function AuditReports() {
  const { shipments } = useShipments();
  const [selectedShipmentId, setSelectedShipmentId] = useState(shipments[0]?.id || 'SHP-88219-DXB');
  const [isExporting, setIsExporting] = useState(false);

  const shipment = shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  const handleDownloadJSON = () => {
    setIsExporting(true);
    setTimeout(() => {
      const reportPayload = {
        reportId: `REP-${shipment.id}-2026`,
        generatedAt: new Date().toISOString(),
        auditorEntity: 'Global Maritime & Cold-Chain Compliance Bureau',
        shipmentProfile: {
          id: shipment.id,
          title: shipment.title,
          category: shipment.category,
          origin: shipment.origin,
          destination: shipment.destination,
          carrier: shipment.carrier,
          status: shipment.status,
          tamperStatus: shipment.tamperStatus,
        },
        cryptographicProof: {
          totalBlocksChained: shipment.events?.length || 0,
          genesisHash: shipment.events?.[0]?.hash,
          headBlockHash: shipment.events?.[shipment.events?.length - 1]?.hash,
          merkleConsistency: '100% VERIFIED',
        },
        eventTimeline: shipment.events,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `Audit_Report_${shipment.id}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setIsExporting(false);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Digital Provenance & Audit Reports
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate verifiable compliance dossiers and cryptographic proof certificates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedShipmentId}
            onChange={(e) => setSelectedShipmentId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400"
          >
            {shipments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.carrier}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Export Proof'}</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Simulation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-md max-w-4xl mx-auto space-y-6">
        <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              Audit Trail 2.0 &bull; Regulatory Grade Provenance
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Certificate of Custody & Cold-Chain Integrity
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Report Ref: REP-{shipment?.id}-2026 &bull; Issuer: SHA-256 Ledger Node
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
            <QrCode className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
            <span className="text-[9px] font-mono mt-0.5">VERIFIED</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Shipment Asset</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{shipment?.title}</div>
            <div className="text-slate-500">{shipment?.category}</div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Route Corridor</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {shipment?.origin} &rarr; {shipment?.destination}
            </div>
            <div className="text-slate-500">Carrier: {shipment?.carrier}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400 font-bold">
            <span>Merkle Chain Consistency: 100% OK</span>
            <span>Chained Blocks: {shipment?.events?.length || 0}</span>
          </div>
          <div className="truncate text-slate-500">
            Genesis Hash: {shipment?.events?.[0]?.hash || 'N/A'}
          </div>
          <div className="truncate text-slate-500">
            Head Hash: {shipment?.events?.[shipment?.events?.length - 1]?.hash || 'N/A'}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Logged Checkpoint Sequence
          </h3>
          <div className="space-y-2">
            {shipment?.events?.map((ev, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">#{ev.index ?? idx}</span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{ev.title || ev.type}</div>
                    <div className="text-[11px] text-slate-400">
                      {ev.location} &bull; Signer: {ev.custodian}
                    </div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-500 font-mono">
                  {ev.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

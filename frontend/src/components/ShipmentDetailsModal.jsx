import React, { useState } from 'react';
import { useShipments } from '../context/ShipmentContext';
import {
  X,
  ShieldCheck,
  Truck,
  MapPin,
  Thermometer,
  Zap,
  Activity,
  Link2,
  Clock,
  PlusCircle,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Download,
  Copy,
  Check,
} from 'lucide-react';

export default function ShipmentDetailsModal() {
  const { selectedShipment, isDetailsOpen, closeDetails, addCheckpointEvent } = useShipments();

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: 'CUSTODY_HANDOVER',
    title: 'Custody Handover Logged',
    location: '',
    custodian: '',
    tempReading: '',
    shockReading: '0.03G',
    payloadDetails: '',
  });

  const [copiedHash, setCopiedHash] = useState(null);

  if (!isDetailsOpen || !selectedShipment) return null;

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.location || !newEvent.custodian) return;
    addCheckpointEvent(selectedShipment.id, newEvent);
    setShowAddEvent(false);
    setNewEvent({
      type: 'CUSTODY_HANDOVER',
      title: 'Custody Handover Logged',
      location: '',
      custodian: '',
      tempReading: '',
      shockReading: '0.03G',
      payloadDetails: '',
    });
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(key);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedShipment, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${selectedShipment.id}_provenance_dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const isTempSafe =
    parseFloat(selectedShipment.temperature) >= selectedShipment.tempRange.min &&
    parseFloat(selectedShipment.temperature) <= selectedShipment.tempRange.max;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-sm font-bold text-cyan-700 dark:text-cyan-400">
                  {selectedShipment.id}
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                    selectedShipment.status === 'IN_TRANSIT'
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                      : selectedShipment.status === 'CUSTOMS_HOLD'
                      ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                  }`}
                >
                  {selectedShipment.status}
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 border ${
                    selectedShipment.tamperStatus === 'VERIFIED'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                  }`}
                >
                  {selectedShipment.tamperStatus === 'VERIFIED' ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {selectedShipment.tamperStatus}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {selectedShipment.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{selectedShipment.origin}</span>
                <span>&rarr;</span>
                <span>{selectedShipment.destination}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportJSON}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Download Provenance Dossier JSON"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={closeDetails}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Real-time Telemetry Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-cyan-500" /> Temperature
              </span>
              <div className={`font-mono text-base font-bold ${isTempSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {selectedShipment.temperature}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Target: {selectedShipment.tempRange.min}°C - {selectedShipment.tempRange.max}°C
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Shock Telemetry
              </span>
              <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
                {selectedShipment.shock}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Limit: &lt; {selectedShipment.shockThreshold}G Max
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-500" /> Primary Carrier
              </span>
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {selectedShipment.carrier}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Custody: {selectedShipment.currentCustodian}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-purple-500" /> AI Risk Index
              </span>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {selectedShipment.riskScore}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                {selectedShipment.events.length} Blocks Chained
              </div>
            </div>
          </div>

          {/* Cryptographic Event Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Cryptographic Event Block Chain ({selectedShipment.events.length} Blocks)</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  SHA-256 Merkle-linked checkpoints verifying non-repudiable provenance
                </p>
              </div>

              <button
                onClick={() => setShowAddEvent(!showAddEvent)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{showAddEvent ? 'Cancel Form' : 'Append Checkpoint Block'}</span>
              </button>
            </div>

            {/* Checkpoint Creation Form */}
            {showAddEvent && (
              <form
                onSubmit={handleCreateEvent}
                className="p-4 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-500/30 space-y-3 animate-fadeIn"
              >
                <div className="text-xs font-bold text-cyan-900 dark:text-cyan-300">
                  Seal New Checkpoint Into SHA-256 Chain
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Event Type
                    </label>
                    <select
                      value={newEvent.type}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          type: e.target.value,
                          title: e.target.value.replace('_', ' '),
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="CUSTODY_HANDOVER">CUSTODY_HANDOVER</option>
                      <option value="COLD_CHAIN_TELEMETRY">COLD_CHAIN_TELEMETRY</option>
                      <option value="CUSTOMS_INSPECTION">CUSTOMS_INSPECTION</option>
                      <option value="DELIVERY_RECEIPT">DELIVERY_RECEIPT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Physical Location
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dubai Cargo Gate 7"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Custodian Signer
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Emirates Cargo Handling"
                      value={newEvent.custodian}
                      onChange={(e) => setNewEvent({ ...newEvent, custodian: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sensor Temperature (°C)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4.0°C"
                      value={newEvent.tempReading}
                      onChange={(e) => setNewEvent({ ...newEvent, tempReading: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Payload Audit Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Transfer receipt signed, seal integrity verified."
                      value={newEvent.payloadDetails}
                      onChange={(e) => setNewEvent({ ...newEvent, payloadDetails: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Seal & Append Block #{selectedShipment.events.length}
                </button>
              </form>
            )}

            {/* Vertical Linked Blocks */}
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 before:z-0">
              {selectedShipment.events.map((ev, idx) => (
                <div
                  key={ev.index}
                  className="relative z-10 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2 ml-2 sm:ml-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-600 text-white">
                        Block #{ev.index}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {ev.type}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ev.timestamp}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div>
                      Custodian: <span className="font-semibold text-slate-900 dark:text-white">{ev.custodian}</span>
                    </div>
                    <div>
                      Location: <span className="font-semibold text-slate-900 dark:text-white">{ev.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    {ev.payloadDetails}
                  </p>

                  {/* Hash chaining details */}
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900/90 font-mono text-[11px] space-y-1 border border-slate-200 dark:border-slate-800">
                    <div className="text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <Link2 className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span className="shrink-0 text-slate-500">Prev Hash:</span>
                        <span className="truncate">{ev.prevHash}</span>
                      </div>
                      <button
                        onClick={() => copyText(ev.prevHash, `prev-${ev.index}`)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
                      >
                        {copiedHash === `prev-${ev.index}` ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    <div className="text-cyan-700 dark:text-cyan-400 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <ShieldCheck className="w-3 h-3 shrink-0" />
                        <span className="shrink-0 font-semibold text-slate-700 dark:text-cyan-300">Block Hash:</span>
                        <span className="truncate font-bold">{ev.hash}</span>
                      </div>
                      <button
                        onClick={() => copyText(ev.hash, `curr-${ev.index}`)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
                      >
                        {copiedHash === `curr-${ev.index}` ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

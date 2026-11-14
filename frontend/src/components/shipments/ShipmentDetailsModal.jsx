import React, { useState } from 'react';
import { useShipments } from '../../context/ShipmentContext';
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-cyan-400 font-bold">{selectedShipment.id}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  {selectedShipment.category}
                </span>
                {selectedShipment.tamperStatus === 'VERIFIED_SECURE' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Ledger Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Hash Tampered
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">{selectedShipment.title}</h2>
            </div>
          </div>
          <button
            onClick={closeDetails}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Carrier / Transporter</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">{selectedShipment.carrier}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Origin Node</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">{selectedShipment.origin}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Destination</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">{selectedShipment.destination}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Thermal Threshold</span>
              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-1">
                {selectedShipment.tempRange.min}°C — {selectedShipment.tempRange.max}°C
              </p>
            </div>
          </div>

          {/* Cryptographic Event Timeline */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Cryptographic Checkpoint Timeline ({selectedShipment.events?.length || 0} Chained Blocks)
                </h3>
              </div>
              <button
                onClick={() => setShowAddEvent(!showAddEvent)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Append Checkpoint Event</span>
              </button>
            </div>

            {/* Add Event Sub-Form */}
            {showAddEvent && (
              <form onSubmit={handleCreateEvent} className="p-4 mb-5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20 space-y-4 animate-fadeIn">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
                  Record New Checkpoint Event & Recalculate SHA-256 Hash
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Event Type</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold"
                    >
                      <option value="CUSTODY_HANDOVER">Custody Handover</option>
                      <option value="TELEMETRY_SAMPLE">IoT Telemetry Sample</option>
                      <option value="CUSTOMS_INSPECTION">Customs Inspection</option>
                      <option value="SEAL_VERIFICATION">Tamper Seal Checked</option>
                      <option value="DELIVERY_CONFIRMATION">Delivery Confirmation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Location / Port</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Frankfurt Cargo Bay 2"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Signer / Custodian</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lufthansa Cargo Agent #402"
                      value={newEvent.custodian}
                      onChange={(e) => setNewEvent({ ...newEvent, custodian: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Temperature (°C)</label>
                    <input
                      type="text"
                      placeholder="e.g. 4.1°C"
                      value={newEvent.tempReading}
                      onChange={(e) => setNewEvent({ ...newEvent, tempReading: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Detailed Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Seal ID #S-9901 inspected intact, transfer to ambient staging."
                      value={newEvent.payloadDetails}
                      onChange={(e) => setNewEvent({ ...newEvent, payloadDetails: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                  >
                    Anchor to Chain
                  </button>
                </div>
              </form>
            )}

            {/* Timeline Sequence */}
            <div className="space-y-3">
              {selectedShipment.events?.map((ev, idx) => (
                <div
                  key={ev.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                        Block #{ev.index ?? idx}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{ev.title || ev.type}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{ev.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {ev.description || ev.payloadDetails || 'Standard checkpoint event recorded.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                    <div>
                      <span className="text-slate-400 font-medium">Location:</span>{' '}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{ev.location}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Custodian:</span>{' '}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{ev.custodian}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Telemetry:</span>{' '}
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                        {ev.tempReading || '3.8°C'} | {ev.shockReading || '0.02G'}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-slate-400 font-mono text-[10px]">
                        {ev.hash ? `${ev.hash.substring(0, 10)}...` : 'genesis'}
                      </span>
                      {ev.hash && (
                        <button
                          onClick={() => handleCopy(ev.hash)}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-cyan-500 transition-colors"
                          title="Copy SHA-256 hash"
                        >
                          {copiedHash === ev.hash ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Immutable Audit Trail Engine &copy; 2026
          </span>
          <button
            onClick={closeDetails}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

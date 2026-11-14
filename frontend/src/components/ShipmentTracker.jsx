import React, { useState } from 'react';
import { useShipments } from '../context/ShipmentContext';
import {
  Truck,
  Thermometer,
  Radio,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Search,
  PlusCircle,
  Filter,
} from 'lucide-react';

export default function ShipmentTracker() {
  const { shipments, openDetails, setIsCreateOpen } = useShipments();
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = shipments.filter((s) => {
    // Status filter
    if (filter === 'ACTIVE' && s.status !== 'IN_TRANSIT') return false;
    if (filter === 'HOLD' && s.status !== 'CUSTOMS_HOLD') return false;
    if (filter === 'ALERT' && s.status !== 'EXCURSION_ALERT') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = s.id.toLowerCase().includes(q);
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchCarrier = s.carrier.toLowerCase().includes(q);
      const matchDest = s.destination.toLowerCase().includes(q);
      const matchOrigin = s.origin.toLowerCase().includes(q);
      return matchId || matchTitle || matchCarrier || matchDest || matchOrigin;
    }

    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-5">
      {/* Top Header & New Shipment Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Shipment Telemetry & Provenance Tracker
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cryptographically verifiable IoT telemetry streams and custody handover checkpoints
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 transition-all self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Provenance Shipment</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, title, carrier or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All Shipments' },
            { id: 'ACTIVE', label: 'In-Transit' },
            { id: 'HOLD', label: 'Customs Hold' },
            { id: 'ALERT', label: 'Excursion Alert' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                filter === f.id
                  ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shipment Items List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No shipments found matching your search or filter criteria.
          </div>
        ) : (
          filtered.map((s) => {
            const isTempSafe =
              parseFloat(s.temperature) >= s.tempRange.min &&
              parseFloat(s.temperature) <= s.tempRange.max;

            return (
              <div
                key={s.id}
                onClick={() => openDetails(s)}
                className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400">
                        {s.id}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          s.status === 'IN_TRANSIT'
                            ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                            : s.status === 'CUSTOMS_HOLD'
                            ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                            : 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                        }`}
                      >
                        {s.status}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1 ${
                          s.tamperStatus === 'VERIFIED'
                            ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                            : 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                        }`}
                      >
                        {s.tamperStatus === 'VERIFIED' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {s.tamperStatus}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {s.events.length} Blocks
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                        {s.title}
                      </h3>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-600 dark:text-cyan-400 shrink-0" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 truncate max-w-md">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{s.origin}</span>
                        <span>&rarr;</span>
                        <span className="truncate">{s.destination}</span>
                      </span>
                      <span>&bull;</span>
                      <span>Carrier: {s.carrier}</span>
                    </div>
                  </div>

                  {/* Telemetry quick values */}
                  <div className="flex items-center gap-6 text-xs border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200 dark:border-slate-800 shrink-0">
                    <div className="space-y-0.5">
                      <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                        <Thermometer className="w-3.5 h-3.5" /> Sensor Temp
                      </div>
                      <div
                        className={`font-mono font-bold ${
                          isTempSafe
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {s.temperature}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                        <Radio className="w-3.5 h-3.5" /> AI Risk
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {s.riskScore}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

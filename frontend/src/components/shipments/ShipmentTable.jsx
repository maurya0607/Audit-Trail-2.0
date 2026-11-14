import React, { useState } from 'react';
import { useShipments } from '../../context/ShipmentContext';
import ShipmentStatusBadge from './ShipmentStatusBadge';
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

export default function ShipmentTable() {
  const { shipments, openDetails, setIsCreateOpen } = useShipments();
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = shipments.filter((s) => {
    if (filter === 'ACTIVE' && s.status !== 'IN_TRANSIT') return false;
    if (filter === 'HOLD' && s.status !== 'CUSTOMS_HOLD') return false;
    if (filter === 'ALERT' && s.status !== 'EXCURSION_ALERT') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = s.id?.toLowerCase().includes(q);
      const matchTitle = s.title?.toLowerCase().includes(q);
      const matchCarrier = s.carrier?.toLowerCase().includes(q);
      const matchDest = s.destination?.toLowerCase().includes(q);
      const matchOrigin = s.origin?.toLowerCase().includes(q);
      return matchId || matchTitle || matchCarrier || matchDest || matchOrigin;
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 transition-colors">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Shipment Verification Directory
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time telemetry and cryptographic status for {shipments.length} tracked assets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, carrier, route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 w-48 sm:w-64"
            />
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/20 transition-all shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Shipment</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Consignments' },
          { id: 'ACTIVE', label: 'Active In-Transit' },
          { id: 'HOLD', label: 'Customs Hold' },
          { id: 'ALERT', label: 'Thermal Excursion Alerts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              filter === tab.id
                ? 'bg-slate-900 text-white dark:bg-cyan-500/20 dark:text-cyan-400 border border-transparent dark:border-cyan-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3 px-3">Shipment Ref</th>
              <th className="py-3 px-3">Cargo Title</th>
              <th className="py-3 px-3">Carrier / Route</th>
              <th className="py-3 px-3">Current Telemetry</th>
              <th className="py-3 px-3">Chain Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filtered.map((s) => (
              <tr
                key={s.id}
                onClick={() => openDetails(s)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {s.id}
                </td>
                <td className="py-3.5 px-3 font-medium text-slate-900 dark:text-white max-w-[200px] truncate">
                  {s.title}
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{s.carrier}</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {s.origin} &rarr; {s.destination}
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1.5 font-mono font-semibold">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{s.currentTemp ?? '3.8'}°C</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Target: {s.tempRange?.min}°C — {s.tempRange?.max}°C
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <ShipmentStatusBadge status={s.status} />
                </td>
                <td className="py-3.5 px-3 text-right">
                  <span className="inline-flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { ShipmentTable as ShipmentTracker };

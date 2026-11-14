import React, { useState } from 'react';
import { Truck, Thermometer, Radio, MapPin, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function ShipmentTracker({ onSelectShipment }) {
  const [filter, setFilter] = useState('ALL');

  const shipments = [
    {
      id: 'SHP-88219-DXB',
      title: 'Biopharma Vaccines (Cold Chain)',
      origin: 'Basel, Switzerland',
      destination: 'Dubai Health Hub, UAE',
      carrier: 'AeroCold Global',
      status: 'IN_TRANSIT',
      temp: '3.8°C',
      tempSafe: true,
      lastEvent: 'Custody Handover - Frankfurt Air Cargo',
      riskScore: 'Low (12/100)',
      tamperStatus: 'VERIFIED',
    },
    {
      id: 'SHP-90412-SGP',
      title: 'Semiconductor Microchips',
      origin: 'Hsinchu, Taiwan',
      destination: 'Jurong Port, Singapore',
      carrier: 'Pacific Freight Express',
      status: 'CUSTOMS_HOLD',
      temp: '22.1°C',
      tempSafe: true,
      lastEvent: 'Inspection Flag - Seal Integrity Audit',
      riskScore: 'Medium (48/100)',
      tamperStatus: 'VERIFIED',
    },
    {
      id: 'SHP-77103-LAX',
      title: 'Perishable Organic Produce',
      origin: 'Oaxaca, Mexico',
      destination: 'Los Angeles Terminal, USA',
      carrier: 'NorthStar Intermodal',
      status: 'EXCURSION_ALERT',
      temp: '14.2°C (Warning)',
      tempSafe: false,
      lastEvent: 'IoT Telemetry: Compressor Fault Logged',
      riskScore: 'Critical (89/100)',
      tamperStatus: 'TAMPER_ALERT',
    },
  ];

  const filtered = shipments.filter(s => {
    if (filter === 'ACTIVE') return s.status === 'IN_TRANSIT';
    if (filter === 'RISK') return s.riskScore.includes('Medium') || s.riskScore.includes('Critical');
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Live Shipment Monitoring
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time IoT telemetry and custody checkpoint streams
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
          {['ALL', 'ACTIVE', 'RISK'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filter === f
                  ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(s => (
          <div
            key={s.id}
            onClick={() => onSelectShipment && onSelectShipment(s)}
            className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 cursor-pointer transition-all hover:shadow-md"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="space-y-1.5">
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
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {s.title}
                  </h3>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-600 dark:text-cyan-400" />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {s.origin} to {s.destination}
                  </span>
                  <span>Carrier: {s.carrier}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5">
                  <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                    <Thermometer className="w-3.5 h-3.5" /> Sensor Temp
                  </div>
                  <div className={`font-mono font-bold ${s.tempSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {s.temp}
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
        ))}
      </div>
    </div>
  );
}

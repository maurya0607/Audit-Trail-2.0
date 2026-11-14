import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ThermometerSnowflake,
  ShieldCheck,
  Truck,
  Clock,
  Compass,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function ShipmentStatusChart() {
  const [timeRange, setTimeRange] = useState('24h');

  // Distribution by Status
  const statusDistribution = [
    { label: 'In-Transit Freight', count: 842, percent: 59, color: 'bg-cyan-500', text: 'text-cyan-700 dark:text-cyan-400' },
    { label: 'Customs Clearance', count: 318, percent: 22, color: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-400' },
    { label: 'Out for Delivery', count: 214, percent: 15, color: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
    { label: 'Thermal / SLA Flagged', count: 54, percent: 4, color: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400' },
  ];

  // Telemetry Health Metrics
  const telemetryHealth = [
    {
      metric: 'Cold-Chain Biopharma (2°C - 8°C)',
      compliance: '99.4%',
      target: 'Threshold ±0.5°C',
      status: 'OPTIMAL',
      icon: ThermometerSnowflake,
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20',
    },
    {
      metric: 'Shock & Vibration Sensor (< 0.2G)',
      compliance: '99.8%',
      target: 'Zero Critical Impacts',
      status: 'VERIFIED',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
    },
    {
      metric: 'Transit Schedule Adherence (SLA)',
      compliance: '97.6%',
      target: 'Mean Delay < 14 min',
      status: 'ON-SCHEDULE',
      icon: Clock,
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
    },
    {
      metric: 'Route Corridor Precision',
      compliance: '98.9%',
      target: 'Max Drift < 2.5 km',
      status: 'MONITORED',
      icon: Compass,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20',
    },
  ];

  // Carrier Performance Benchmarks
  const carrierRankings = [
    { name: 'Swiss WorldCargo AG', loads: 480, onTimeRate: '99.2%', avgTemp: '3.9°C', score: '99.6/100', status: 'TIER-1 GOLD' },
    { name: 'Emirates SkyCargo', loads: 420, onTimeRate: '98.5%', avgTemp: '4.1°C', score: '98.8/100', status: 'TIER-1 GOLD' },
    { name: 'Lufthansa Cargo Phx', loads: 310, onTimeRate: '96.8%', avgTemp: '4.4°C', score: '96.4/100', status: 'VERIFIED' },
    { name: 'NorthStar Intermodal', loads: 218, onTimeRate: '94.1%', avgTemp: '5.2°C', score: '91.2/100', status: 'PROBATION' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 transition-colors">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Shipment Status & Telemetry Analytics</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time multi-carrier fleet metrics across 1,428 monitored freight units
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
          {['24h', '7d', '30d', 'Quarterly'].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeRange === r
                  ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Progress / Segmented Meter Bar */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">Fleet Stage Distribution</span>
          <span className="font-mono text-slate-500 dark:text-slate-400">Active Shipments: 1,428 Units</span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          {statusDistribution.map((s, idx) => (
            <div
              key={idx}
              style={{ width: `${s.percent}%` }}
              className={`${s.color} transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
              title={`${s.label}: ${s.count} (${s.percent}%)`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {statusDistribution.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${s.color} shrink-0`} />
              <div className="min-w-0">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{s.label}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {s.count} <span className="font-normal text-slate-400">({s.percent}%)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor SLA Performance Matrix */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Cold-Chain & Sensor Compliance Benchmarks
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {telemetryHealth.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`p-2 rounded-xl border ${item.bgColor}`}>
                      <Icon className={`w-4 h-4 ${item.iconColor}`} />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">{item.metric}</div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between">
                  <div>
                    <div className="text-lg font-black text-slate-900 dark:text-white leading-none">{item.compliance}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.target}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transporter / Carrier Performance League */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Carrier Performance & SLA Compliance League
          </h4>
          <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
            <span>Audited by AI Risk Model</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase">
              <tr>
                <th className="py-2.5 px-4">Carrier Partner</th>
                <th className="py-2.5 px-4">Volume (Units)</th>
                <th className="py-2.5 px-4">On-Time SLA</th>
                <th className="py-2.5 px-4">Avg Temp Drift</th>
                <th className="py-2.5 px-4">Audit Rating</th>
                <th className="py-2.5 px-4 text-right">Status Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {carrierRankings.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.name}</span>
                  </td>
                  <td className="py-2.5 px-4 font-mono">{c.loads}</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">{c.onTimeRate}</td>
                  <td className="py-2.5 px-4 font-mono">{c.avgTemp}</td>
                  <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">{c.score}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status.includes('GOLD')
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                          : c.status === 'VERIFIED'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export { ShipmentStatusChart as ShipmentStatistics };

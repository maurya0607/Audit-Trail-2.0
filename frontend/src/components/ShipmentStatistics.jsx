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

export default function ShipmentStatistics() {
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
  ];

  // Carrier Compliance Leaderboard
  const carrierRanking = [
    { name: 'AeroCold Global', loads: 524, onTime: '99.8%', auditScore: '99.9%', status: 'Tier 1 Certified' },
    { name: 'Swiss WorldCargo AG', loads: 412, onTime: '99.2%', auditScore: '99.5%', status: 'Tier 1 Certified' },
    { name: 'Pacific Freight Express', loads: 310, onTime: '96.4%', auditScore: '97.2%', status: 'Tier 2 Active' },
    { name: 'NorthStar Intermodal', loads: 182, onTime: '91.8%', auditScore: '89.4%', status: 'Audit Review' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Shipment Telemetry & Carrier Statistics
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time aggregate performance metrics across 1,428 monitored freight units
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
          {['24h', '7d', '30d'].map((r) => (
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

      {/* Grid: Status Distribution & Telemetry Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Freight Status Distribution Bar */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Fleet Status Distribution
            </span>
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
              1,428 Total
            </span>
          </div>

          {/* Segmented Progress Bar */}
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

          {/* Legend Items */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {statusDistribution.map((s, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.color} shrink-0`} />
                  <span className="text-slate-600 dark:text-slate-400 font-medium truncate">
                    {s.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 pl-4">
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {s.count}
                  </span>
                  <span className={`text-[11px] font-semibold ${s.text}`}>
                    ({s.percent}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Real-time Telemetry Health Index */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Telemetry Compliance SLAs
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              99.2% Overall
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {telemetryHealth.map((th, idx) => {
              const Icon = th.icon;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-lg border ${th.bgColor} shrink-0`}>
                      <Icon className={`w-4 h-4 ${th.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {th.metric}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {th.target}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                      {th.compliance}
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
                      {th.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Carrier Compliance & Reliability Table */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Carrier Cryptographic Reliability Index
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Contractual audit scores and on-time performance based on immutable handoff proofs
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Carrier Partner</th>
                <th className="py-2.5 px-4">Monitored Loads</th>
                <th className="py-2.5 px-4">On-Time SLA</th>
                <th className="py-2.5 px-4">Audit Provenance Score</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
              {carrierRanking.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                    {c.loads} Units
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                    {c.onTime}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {c.auditScore}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        c.status.includes('Tier 1')
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                          : c.status.includes('Tier 2')
                          ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                          : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
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

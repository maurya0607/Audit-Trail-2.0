import React from 'react';
import {
  Package,
  ShieldCheck,
  AlertTriangle,
  Scale,
  TrendingUp,
} from 'lucide-react';

// Responsive, overflow-safe SVG Sparkline
function Sparkline({ data, color, gradientId }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="w-16 sm:w-20 md:w-24 h-7 overflow-hidden shrink-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
}

export function StatCard({ s, idx }) {
  const Icon = s.icon;
  return (
    <div
      className={`group relative rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between ${s.cardBorder}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`p-2.5 rounded-xl border ${s.bgColor} transition-transform group-hover:scale-105 duration-200`}
          >
            <Icon className={`w-5 h-5 ${s.iconColor}`} />
          </span>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${s.badgeColor}`}
          >
            {s.badge}
          </span>
        </div>

        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
          {s.label}
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {s.value}
          </span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {s.unit}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 truncate">
            {s.trend}
          </span>
        </div>

        <Sparkline
          data={s.sparkline}
          color={s.sparklineColor}
          gradientId={`stat-spark-${idx}`}
        />
      </div>
    </div>
  );
}

export default function StatsCards() {
  const stats = [
    {
      label: 'Active Consignments',
      value: '1,428',
      unit: 'Units',
      trend: '+12.4% vs last week',
      icon: Package,
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20',
      badge: 'Real-Time',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/30',
      cardBorder: 'hover:border-cyan-500/50',
      sparkline: [42, 48, 55, 51, 62, 70, 78, 85],
      sparklineColor: '#06b6d4',
    },
    {
      label: 'Cryptographic Chain Integrity',
      value: '99.98',
      unit: '% Verified',
      trend: 'Zero Broken Hashes',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
      badge: 'Immutable',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30',
      cardBorder: 'hover:border-emerald-500/50',
      sparkline: [98, 99, 99.4, 99.8, 99.9, 100, 99.98, 100],
      sparklineColor: '#10b981',
    },
    {
      label: 'Thermal Excursion Alerts',
      value: '3',
      unit: 'Critical',
      trend: '-62% vs baseline',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
      badge: 'Active SLA',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
      cardBorder: 'hover:border-amber-500/50',
      sparkline: [12, 10, 8, 7, 5, 4, 4, 3],
      sparklineColor: '#f59e0b',
    },
    {
      label: 'Dispute Settlement Desk',
      value: '$482.5K',
      unit: 'Protected',
      trend: '94.2% AI resolution',
      icon: Scale,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20',
      badge: 'Audited',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/30',
      cardBorder: 'hover:border-indigo-500/50',
      sparkline: [320, 360, 410, 430, 440, 460, 475, 482.5],
      sparklineColor: '#6366f1',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => (
        <StatCard key={s.label} s={s} idx={idx} />
      ))}
    </div>
  );
}

export { StatsCards };

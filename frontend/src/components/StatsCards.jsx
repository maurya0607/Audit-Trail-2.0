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

export default function StatsCards() {
  const stats = [
    {
      id: 'active-freight',
      badge: 'Live IoT Telemetry',
      badgeColor:
        'text-cyan-700 bg-cyan-50 border-cyan-200 dark:text-cyan-300 dark:bg-cyan-500/10 dark:border-cyan-500/30',
      title: 'Active Freight Monitored',
      value: '1,428',
      unit: 'Units',
      trend: '+12.4%',
      trendLabel: 'vs prior 24h',
      subtextLeft: '48 Port Terminals',
      subtextRight: '100% GPS Sync',
      icon: Package,
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      iconBg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-100 dark:border-cyan-500/20',
      sparklineColor: '#06b6d4',
      sparklineData: [28, 35, 42, 38, 55, 62, 59, 74, 82, 88],
      cardBorder: 'hover:border-cyan-500/40 dark:hover:border-cyan-500/50',
    },
    {
      id: 'chain-integrity',
      badge: 'SHA-256 Merkle Chain',
      badgeColor:
        'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30',
      title: 'Cryptographic Proofs',
      value: '100%',
      unit: 'Verified',
      trend: '14,892',
      trendLabel: 'chained blocks',
      subtextLeft: 'Zero Breaches',
      subtextRight: 'Non-Repudiable',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
      sparklineColor: '#10b981',
      sparklineData: [99.8, 99.9, 100, 99.95, 100, 100, 100, 100, 100, 100],
      cardBorder: 'hover:border-emerald-500/40 dark:hover:border-emerald-500/50',
    },
    {
      id: 'ai-risk-radar',
      badge: 'Predictive Anomaly AI',
      badgeColor:
        'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30',
      title: 'Active Risk Interceptions',
      value: '3',
      unit: 'Flagged',
      trend: 'Low Risk',
      trendLabel: 'overall fleet',
      subtextLeft: '2 Thermal Excursions',
      subtextRight: '1 Dwell Bottleneck',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20',
      sparklineColor: '#f59e0b',
      sparklineData: [7, 5, 8, 4, 6, 9, 5, 4, 3, 3],
      cardBorder: 'hover:border-amber-500/40 dark:hover:border-amber-500/50',
    },
    {
      id: 'dispute-arbitration',
      badge: 'Zero-Trust Arbitration',
      badgeColor:
        'text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-500/10 dark:border-purple-500/30',
      title: 'Dispute Settlement Value',
      value: '$482.5K',
      unit: 'Protected',
      trend: '42s',
      trendLabel: 'avg. auto-resolution',
      subtextLeft: '18 Claims Settled',
      subtextRight: '0% Manual Overhead',
      icon: Scale,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20',
      sparklineColor: '#a855f7',
      sparklineData: [120, 180, 240, 290, 310, 380, 420, 450, 482],
      cardBorder: 'hover:border-purple-500/40 dark:hover:border-purple-500/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={s.id}
            className={`group relative rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between ${s.cardBorder}`}
          >
            {/* Top row: Badge Pill & Icon */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border truncate shrink min-w-0 ${s.badgeColor}`}
                >
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
                  </span>
                  <span className="truncate">{s.badge}</span>
                </span>

                <div
                  className={`p-2 rounded-xl border shrink-0 transition-colors ${s.iconBg}`}
                >
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>

              {/* Metric Title */}
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase truncate">
                {s.title}
              </h3>

              {/* Value & Mini Sparkline */}
              <div className="flex items-baseline justify-between gap-2 mt-1.5 mb-3 min-w-0">
                <div className="flex items-baseline gap-1.5 truncate min-w-0">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white truncate">
                    {s.value}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
                    {s.unit}
                  </span>
                </div>

                {/* Compact Sparkline */}
                <Sparkline
                  data={s.sparklineData}
                  color={s.sparklineColor}
                  gradientId={`sparkline-grad-${idx}`}
                />
              </div>
            </div>

            {/* Trend & Secondary Metadata (Wrapped safely to prevent overflow) */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-1.5 text-[11px] mt-auto">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 flex-wrap">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span>{s.trend}</span>
                <span className="font-normal text-slate-500 dark:text-slate-400 truncate">
                  {s.trendLabel}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-0.5 font-medium text-[10px] sm:text-[11px] gap-1 flex-wrap">
                <span className="truncate">{s.subtextLeft}</span>
                <span className="text-slate-300 dark:text-slate-700 shrink-0">&bull;</span>
                <span className="truncate">{s.subtextRight}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

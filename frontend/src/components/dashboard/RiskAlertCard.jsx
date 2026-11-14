import React from 'react';
import { AlertTriangle, ThermometerSnowflake, Clock } from 'lucide-react';

export default function RiskAlertCard() {
  const alerts = [
    {
      id: 'RSK-991',
      title: 'Cold-Chain Excursion Risk (+6.4°C)',
      shipmentId: 'SHP-77103-LAX',
      time: '12m ago',
      severity: 'HIGH',
      icon: ThermometerSnowflake,
    },
    {
      id: 'RSK-988',
      title: 'Custody Handover Dwell Delay (>4.2h)',
      shipmentId: 'SHP-90412-SGP',
      time: '1h ago',
      severity: 'MEDIUM',
      icon: Clock,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Risk Alerts</h3>
      </div>

      <div className="space-y-3">
        {alerts.map((a) => {
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                a.severity === 'HIGH'
                  ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30'
                  : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${a.severity === 'HIGH' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`} />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{a.title}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{a.shipmentId} &bull; {a.time}</div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border shrink-0 ${
                a.severity === 'HIGH'
                  ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                  : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
              }`}>
                {a.severity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

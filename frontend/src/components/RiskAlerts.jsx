import React from 'react';
import { AlertTriangle, ThermometerSnowflake, Clock, Compass } from 'lucide-react';

export default function RiskAlerts() {
  const alerts = [
    {
      id: 'RSK-991',
      severity: 'HIGH',
      title: 'Cold-Chain Excursion Risk (+6.4°C over threshold)',
      shipmentId: 'SHP-77103-LAX',
      time: '12 mins ago',
      category: 'Temperature Anomaly',
      icon: ThermometerSnowflake,
      details: 'Sustained thermal rise for >45 minutes detected between Sonora checkpoint and Mexicali corridor.',
      action: 'Automated notification dispatched to carrier refrigeration dispatch.',
    },
    {
      id: 'RSK-988',
      severity: 'MEDIUM',
      title: 'Custody Handover Dwell Delay (>4.2 hours)',
      shipmentId: 'SHP-90412-SGP',
      time: '1 hour ago',
      category: 'Handoff Bottleneck',
      icon: Clock,
      details: 'Package stationed in customs holding area exceeding contractual turnaround SLA.',
      action: 'Escalated to customs clearance agent for immediate seal verification.',
    },
    {
      id: 'RSK-982',
      severity: 'LOW',
      title: 'Minor Route Deviation (Secondary Corridor)',
      shipmentId: 'SHP-88219-DXB',
      time: '3 hours ago',
      category: 'Geofence Advisory',
      icon: Compass,
      details: 'Carrier rerouted via bypass due to road construction; ETA remains on schedule.',
      action: 'Audited and marked safe by AI routing model.',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Risk Detection Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Predictive logistics anomaly detection & early mitigation triggers
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map(a => {
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              className={`p-4 rounded-xl border transition-colors ${
                a.severity === 'HIGH'
                  ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30'
                  : a.severity === 'MEDIUM'
                  ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/30'
                  : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg ${
                      a.severity === 'HIGH'
                        ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                        : a.severity === 'MEDIUM'
                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                        : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {a.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-cyan-700 dark:text-cyan-400 font-semibold">
                    {a.shipmentId}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                  <span className="text-slate-500 dark:text-slate-400">{a.time}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 sm:ml-8 mb-2 leading-relaxed">
                {a.details}
              </p>

              <div className="sm:ml-8 text-[11px] bg-white dark:bg-slate-900/90 p-2.5 rounded-lg text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                <span className="text-cyan-700 dark:text-cyan-400 font-semibold">Action Protocol:</span> {a.action}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

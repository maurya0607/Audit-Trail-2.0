import React, { useState } from 'react';
import { AlertTriangle, ThermometerSnowflake, Clock, Compass, Filter, ArrowUpRight } from 'lucide-react';

export default function RiskAlertList() {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

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

  const filtered = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Risk Detection Center</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time anomaly heuristics, thermal violations, and delay forecasting
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterSeverity === s
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 bg-slate-50/50 dark:bg-slate-950/40 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      alert.severity === 'HIGH'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                        : alert.severity === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                        : 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                    }`}
                  >
                    {alert.severity} Risk
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                    {alert.shipmentId}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">{alert.time}</span>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Icon className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{alert.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{alert.details}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Action:</span> {alert.action}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <span>Protocol Active</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { RiskAlertList as RiskAlerts };

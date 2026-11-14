import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Truck,
  ThermometerSnowflake,
  FileText,
  Clock,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  PlusCircle,
} from 'lucide-react';

export default function RecentActivities() {
  const [filter, setFilter] = useState('ALL');
  const [simulating, setSimulating] = useState(false);

  const initialActivities = [
    {
      id: 'ACT-9082',
      type: 'CUSTODY_HANDOVER',
      category: 'CUSTODY',
      title: 'Custody Handover Confirmed',
      description: 'Swiss WorldCargo AG signed physical handoff from Novartis Basel Dispatch.',
      shipmentId: 'SHP-88219-DXB',
      blockIndex: 1,
      blockHash: '148fa721...948a',
      time: '4 mins ago',
      timestamp: '2026-11-14 14:56 UTC',
      status: 'VERIFIED',
      icon: Truck,
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      iconBg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20',
    },
    {
      id: 'ACT-9081',
      type: 'COLD_CHAIN_TELEMETRY',
      category: 'TELEMETRY',
      title: 'IoT Telemetry Ping Logged',
      description: 'Active compressor telemetry reported 3.8°C (safe range 2°C - 8°C). G-force: 0.04G.',
      shipmentId: 'SHP-88219-DXB',
      blockIndex: 2,
      blockHash: '57b91048...0298',
      time: '12 mins ago',
      timestamp: '2026-11-14 14:48 UTC',
      status: 'VERIFIED',
      icon: ThermometerSnowflake,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
    },
    {
      id: 'ACT-9080',
      type: 'INTEGRITY_AUDIT',
      category: 'AUDIT',
      title: 'Cryptographic Chain Audit Passed',
      description: 'Scheduled SHA-256 Merkle root verification matched all 14,892 blocks in ledger.',
      shipmentId: 'GLOBAL_FLEET',
      blockIndex: 14892,
      blockHash: 'a012948c...834b',
      time: '28 mins ago',
      timestamp: '2026-11-14 14:32 UTC',
      status: 'AUDIT_PASSED',
      icon: ShieldCheck,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20',
    },
    {
      id: 'ACT-9079',
      type: 'DISPUTE_ARBITRATED',
      category: 'AUDIT',
      title: 'Automated Dispute Settlement Rendered',
      description: 'Claim #DSP-081 ($24,500) arbitrated with 100% liability assigned to carrier based on Block #5 proof.',
      shipmentId: 'SHP-77103-LAX',
      blockIndex: 5,
      blockHash: '9a8f10bc...48ba',
      time: '45 mins ago',
      timestamp: '2026-11-14 14:15 UTC',
      status: 'RESOLVED',
      icon: FileText,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
    },
    {
      id: 'ACT-9078',
      type: 'CUSTOMS_INSPECTION',
      category: 'CUSTODY',
      title: 'Port Customs Seal Verification',
      description: 'Jurong Port Authority confirmed digital tamper seal unbroken and registered in chain.',
      shipmentId: 'SHP-90412-SGP',
      blockIndex: 3,
      blockHash: '3b01984c...024a',
      time: '1 hour ago',
      timestamp: '2026-11-14 14:00 UTC',
      status: 'VERIFIED',
      icon: ShieldCheck,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
    },
  ];

  const [activities, setActivities] = useState(initialActivities);

  // Live simulation of new incoming activity event for judges
  const handleSimulateNewEvent = () => {
    setSimulating(true);
    setTimeout(() => {
      const newEvent = {
        id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'TELEMETRY_SAMPLE',
        category: 'TELEMETRY',
        title: 'New IoT Sensor Checkpoint Mapped',
        description: 'Flight LX108 reached Dubai airspace. Temp: 4.1°C, Pressure: 1013 hPa. Block sealed.',
        shipmentId: 'SHP-88219-DXB',
        blockIndex: activities.length + 1,
        blockHash: `7f${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`,
        time: 'Just now',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        status: 'VERIFIED',
        icon: ThermometerSnowflake,
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        iconBg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20',
      };
      setActivities([newEvent, ...activities]);
      setSimulating(false);
    }, 500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'audit_trail_activities.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = activities.filter((a) => {
    if (filter === 'ALL') return true;
    return a.category === filter;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Live Audit & Telemetry Activity Stream
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chronological cryptographic ledger operations, custody transitions, and sensor events
          </p>
        </div>

        {/* Action buttons: Simulate + Export */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleSimulateNewEvent}
            disabled={simulating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-all"
            title="Simulate live incoming IoT checkpoint"
          >
            <PlusCircle className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
            <span>Simulate Incoming Event</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            title="Download verified activity stream in JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          Filter:
        </span>
        {['ALL', 'AUDIT', 'TELEMETRY', 'CUSTODY'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === f
                ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-cyan-400 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl border ${item.iconBg} shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${item.iconColor}`} />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.shipmentId}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          item.status === 'VERIFIED' || item.status === 'AUDIT_PASSED'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                            : 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
                      <span>Block #{item.blockIndex}</span>
                      <span>&bull;</span>
                      <span className="truncate max-w-[150px]">Hash: {item.blockHash}</span>
                      <span>&bull;</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 sm:text-right pl-11 sm:pl-0">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center sm:justify-end gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

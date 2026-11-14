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

export default function RecentActivity() {
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
      category: 'LEDGER',
      title: 'Cryptographic Chain Audit Passed',
      description: 'Scheduled SHA-256 Merkle root verification matched all 14,892 blocks in global ledger.',
      shipmentId: 'GLOBAL_FLEET',
      blockIndex: 14892,
      blockHash: 'a012948c...834b',
      time: '28 mins ago',
      timestamp: '2026-11-14 14:32 UTC',
      status: 'VERIFIED',
      icon: ShieldCheck,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20',
    },
    {
      id: 'ACT-9079',
      type: 'EVIDENCE_ANCHORED',
      category: 'EVIDENCE',
      title: 'Customs Seal Certificate Anchored',
      description: 'EU Import Customs release documentation cryptographic fingerprint hashed to block #4.',
      shipmentId: 'SHP-90412-SGP',
      blockIndex: 4,
      blockHash: '7c98012f...1102',
      time: '45 mins ago',
      timestamp: '2026-11-14 14:15 UTC',
      status: 'VERIFIED',
      icon: FileText,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
    },
  ];

  const [activities, setActivities] = useState(initialActivities);

  const filteredActivities = activities.filter((act) => {
    if (filter === 'ALL') return true;
    return act.category === filter;
  });

  const handleSimulateNewPing = () => {
    setSimulating(true);
    setTimeout(() => {
      const now = new Date();
      const newAct = {
        id: `ACT-${Math.floor(9083 + Math.random() * 50)}`,
        type: 'COLD_CHAIN_TELEMETRY',
        category: 'TELEMETRY',
        title: 'Real-Time Sensor Checkpoint Ingested',
        description: `Live compressor reading 4.1°C via Flight LX108 In-Transit Transponder.`,
        shipmentId: 'SHP-88219-DXB',
        blockIndex: activities.length + 1,
        blockHash: `${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        time: 'Just now',
        timestamp: `${now.toISOString().replace('T', ' ').substring(0, 19)} UTC`,
        status: 'VERIFIED',
        icon: ThermometerSnowflake,
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        iconBg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20',
      };
      setActivities([newAct, ...activities]);
      setSimulating(false);
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Shipment Activities</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time multi-party immutable audit events streamed live
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateNewPing}
            disabled={simulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
          >
            <RotateCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin text-cyan-500' : ''}`} />
            <span>Simulate Ping</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredActivities.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 bg-slate-50/50 dark:bg-slate-950/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <span className={`p-2 rounded-xl border ${act.iconBg} shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${act.iconColor}`} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{act.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      {act.shipmentId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">{act.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200 dark:border-slate-800 text-[11px]">
                <div className="text-right">
                  <div className="text-slate-400 font-mono text-[10px]">{act.blockHash}</div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">{act.time}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{act.status}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { RecentActivity as RecentActivities };

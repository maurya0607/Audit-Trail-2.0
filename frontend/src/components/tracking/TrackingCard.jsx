import React from 'react';
import { Navigation, MapPin } from 'lucide-react';

export default function TrackingCard({ origin, destination, currentWaypoint, speed = '840 km/h' }) {
  return (
    <div className="p-4 rounded-xl bg-slate-950 text-white border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <Navigation className="w-3.5 h-3.5" /> GPS Real-Time Corridor
        </span>
        <span className="text-xs font-mono text-slate-400">{speed}</span>
      </div>
      <div className="text-sm font-bold truncate">{origin} &rarr; {destination}</div>
      <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
        <MapPin className="w-3.5 h-3.5 text-cyan-500" /> Current Checkpoint: {currentWaypoint || 'In-Flight'}
      </div>
    </div>
  );
}

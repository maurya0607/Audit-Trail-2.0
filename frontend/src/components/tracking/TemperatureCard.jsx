import React from 'react';
import { Thermometer } from 'lucide-react';

export default function TemperatureCard({ temp, min = 2.0, max = 8.0 }) {
  const isSafe = parseFloat(temp) >= min && parseFloat(temp) <= max;
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Thermometer className="w-4 h-4 text-cyan-500" /> Sensor Temperature
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          isSafe ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          {isSafe ? 'OPTIMAL' : 'EXCURSION'}
        </span>
      </div>
      <div className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white">{temp}°C</div>
      <div className="text-[10px] font-mono text-slate-400">Target Range: {min}°C - {max}°C</div>
    </div>
  );
}

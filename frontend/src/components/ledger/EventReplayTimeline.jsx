import React, { useState } from 'react';
import { useShipments } from '../../context/ShipmentContext';
import {
  RotateCcw,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Clock,
  MapPin,
  Thermometer,
  ShieldCheck,
  Zap,
  Activity,
  Link2,
} from 'lucide-react';

export default function EventReplayTimeline() {
  const { shipments } = useShipments();
  const [selectedShipmentId, setSelectedShipmentId] = useState(shipments[0]?.id || 'SHP-88219-DXB');
  const currentShipment = shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  const [currentSeq, setCurrentSeq] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalEvents = currentShipment?.events?.length || 1;
  const activeEvent = currentShipment?.events?.[currentSeq] || currentShipment?.events?.[0];

  // Auto-play animation simulation
  React.useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSeq((prev) => {
          if (prev >= totalEvents - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalEvents]);

  const handleStepPrev = () => {
    if (currentSeq > 0) setCurrentSeq(currentSeq - 1);
  };

  const handleStepNext = () => {
    if (currentSeq < totalEvents - 1) setCurrentSeq(currentSeq + 1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Historical Event Replay & State Reconstruction
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reconstruct custody, location, and telemetry snapshot at sequence index #{currentSeq}
          </p>
        </div>

        {/* Shipment Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Consignment:</label>
          <select
            value={selectedShipmentId}
            onChange={(e) => {
              setSelectedShipmentId(e.target.value);
              setCurrentSeq(0);
              setIsPlaying(false);
            }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400"
          >
            {shipments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.carrier}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scrubber Controls */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
              Scrubber Sequence: {currentSeq} / {totalEvents - 1}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
              Block #{activeEvent?.index ?? currentSeq}
            </span>
          </div>

          {/* Play / Step Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleStepPrev}
              disabled={currentSeq === 0}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40"
              title="Previous Checkpoint"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
            </button>
            <button
              onClick={handleStepNext}
              disabled={currentSeq === totalEvents - 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40"
              title="Next Checkpoint"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="0"
          max={totalEvents - 1}
          value={currentSeq}
          onChange={(e) => setCurrentSeq(parseInt(e.target.value))}
          className="w-full accent-cyan-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>Seq #0 (Genesis Dispatch)</span>
          <span>Seq #{totalEvents - 1} (Latest Event)</span>
        </div>
      </div>

      {/* Reconstructed State Snapshot */}
      {activeEvent && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-cyan-500/30 shadow-md shadow-cyan-500/5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Reconstructed Snapshot
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {activeEvent.title || activeEvent.type}
              </h4>
            </div>
            <span className="text-xs text-slate-400 font-mono">{activeEvent.timestamp}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Geographic Location</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                <span>{activeEvent.location}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Custodian in Charge</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>{activeEvent.custodian}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Reefer Telemetry</span>
              <div className="font-semibold text-cyan-600 dark:text-cyan-400 mt-1 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-cyan-500" />
                <span>{activeEvent.tempReading || '3.8°C'} | G-Shock {activeEvent.shockReading || '0.02G'}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-700 dark:text-slate-300">Payload State:</span>{' '}
            {activeEvent.payloadDetails || activeEvent.description}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="truncate">Hash: {activeEvent.hash}</span>
            <span className="font-bold text-emerald-500 shrink-0">Cryptographically Valid</span>
          </div>
        </div>
      )}
    </div>
  );
}

export { EventReplayTimeline as EventReplay };

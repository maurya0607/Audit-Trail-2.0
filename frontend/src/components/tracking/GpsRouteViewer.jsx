import React, { useState, useEffect } from 'react';
import { useShipments } from '../../context/ShipmentContext';
import {
  Navigation,
  Radio,
  Thermometer,
  Zap,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Wifi,
} from 'lucide-react';

export default function GpsRouteViewer() {
  const { shipments } = useShipments();
  const [selectedId, setSelectedId] = useState(shipments[0]?.id || 'SHP-88219-DXB');
  const [liveTemp, setLiveTemp] = useState(3.8);
  const [gpsCoordinates, setGpsCoordinates] = useState({ lat: 25.0757, lng: 55.1888 });
  const [wsPing, setWsPing] = useState(28);

  const shipment = shipments.find((s) => s.id === selectedId) || shipments[0];

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 0.2;
      setLiveTemp((prev) => parseFloat((prev + delta).toFixed(2)));
      setWsPing(Math.floor(24 + Math.random() * 8));
    }, 2500);
    return () => clearInterval(interval);
  }, [selectedId]);

  const waypoints = [
    { city: 'Basel Bio Hub', country: 'Switzerland', status: 'DEPARTED', time: '08:15 UTC', completed: true },
    { city: 'Zurich Air Cargo', country: 'Switzerland', status: 'CUSTODY_HANDOVER', time: '11:42 UTC', completed: true },
    { city: 'Frankfurt Hub', country: 'Germany', status: 'TRANSIT_HOLD', time: '14:30 UTC', completed: true },
    { city: 'Dubai DWC Hub', country: 'UAE', status: 'APPROACHING', time: '17:05 UTC', completed: false, current: true },
    { city: 'Dubai Health Hub', country: 'UAE', status: 'FINAL_DELIVERY', time: 'Est. 20:00 UTC', completed: false },
  ];

  const isTempSafe =
    liveTemp >= (shipment?.tempRange?.min ?? 2) && liveTemp <= (shipment?.tempRange?.max ?? 8);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Real-Time Telemetry & GPS In-Flight Tracking
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live sub-second WebSocket telemetry connected to active carrier transponders
          </p>
        </div>

        {/* Consignment Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-mono font-bold">
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            <span>WS {wsPing}ms</span>
          </div>

          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
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

      {/* Live Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Temp Card */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isTempSafe
              ? 'bg-cyan-50/50 dark:bg-cyan-500/5 border-cyan-200 dark:border-cyan-500/20'
              : 'bg-rose-50/50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cargo Probe Temperature
            </span>
            <Thermometer className={`w-4 h-4 ${isTempSafe ? 'text-cyan-500' : 'text-rose-500'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${isTempSafe ? 'text-cyan-600 dark:text-cyan-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {liveTemp}°C
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Bounds: {shipment?.tempRange?.min}°C — {shipment?.tempRange?.max}°C
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {isTempSafe ? 'Thermal integrity compliant with WHO cold-chain protocol' : 'Excursion alert triggered'}
          </p>
        </div>

        {/* GPS Card */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Coordinate Transponder
            </span>
            <Compass className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {gpsCoordinates.lat}° N, {gpsCoordinates.lng}° E
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Approaching Dubai DWC Airspace &bull; Altitude 12,400 ft
          </p>
        </div>

        {/* Shock & Seal */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tamper Seal & Vibration
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              0.02 G
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Seal #S-9901 INTACT
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Zero shock anomalies recorded in the last 12 hours
          </p>
        </div>
      </div>

      {/* Simulated Route Progress Visualizer */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Intermodal Route Waypoints (Flight LX108 / Ground Delivery)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {waypoints.map((wp, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border relative ${
                wp.completed
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : wp.current
                  ? 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-slate-400">Stop #{idx + 1}</span>
                {wp.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : wp.current ? (
                  <Radio className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{wp.city}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{wp.country}</div>
              <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mt-2 font-semibold">
                {wp.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { GpsRouteViewer as LiveTracking, GpsRouteViewer as TrackingCard };

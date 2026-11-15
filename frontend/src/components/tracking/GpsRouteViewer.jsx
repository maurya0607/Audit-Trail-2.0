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
  Plane,
  ArrowRight,
  Wifi,
  ShieldCheck,
  Maximize2,
  Info,
} from 'lucide-react';

export default function GpsRouteViewer() {
  const { shipments } = useShipments();
  const [selectedId, setSelectedId] = useState(shipments[0]?.id || 'SHP-88219-DXB');
  const [liveTemp, setLiveTemp] = useState(3.8);
  const [gpsCoordinates, setGpsCoordinates] = useState({ lat: 25.0757, lng: 55.1888 });
  const [wsPing, setWsPing] = useState(28);
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);
  const [simulationProgress, setSimulationProgress] = useState(68); // 0 - 100%

  const shipment = shipments.find((s) => s.id === selectedId) || shipments[0];

  // Simulated live telemetry stream via WebSocket
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 0.2;
      setLiveTemp((prev) => parseFloat((prev + delta).toFixed(2)));
      setWsPing(Math.floor(24 + Math.random() * 8));

      // Advance moving vehicle
      setSimulationProgress((prev) => (prev >= 98 ? 60 : parseFloat((prev + 0.3).toFixed(1))));
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedId]);

  // Waypoints for the selected freight corridor
  const waypoints = [
    {
      id: 'WP-1',
      city: 'Basel Bio Hub',
      country: 'Switzerland',
      code: 'BSL',
      type: 'DISPATCH_ORIGIN',
      status: 'COMPLETED',
      time: '08:15 UTC',
      x: 120,
      y: 110,
      temp: '3.5°C',
      custodian: 'Novartis Pharma AG',
      notes: 'Initial dispatch and cold container sealing verified with Genesis Block #0.',
      completed: true,
    },
    {
      id: 'WP-2',
      city: 'Zurich Airport Cargo',
      country: 'Switzerland',
      code: 'ZRH',
      type: 'AIR_CARGO_HANDOFF',
      status: 'COMPLETED',
      time: '11:42 UTC',
      x: 230,
      y: 125,
      temp: '3.7°C',
      custodian: 'Swiss WorldCargo AG',
      notes: 'Physical custody transfer to Flight LX108 air pallet. Reefer unit operational.',
      completed: true,
    },
    {
      id: 'WP-3',
      city: 'Frankfurt Hub Checkpoint',
      country: 'Germany',
      code: 'FRA',
      type: 'TRANSIT_INTERCHANGE',
      status: 'COMPLETED',
      time: '14:30 UTC',
      x: 390,
      y: 135,
      temp: '3.8°C',
      custodian: 'Lufthansa Air Cargo',
      notes: 'En-route high-altitude telematics sample. Vibration levels nominal at 0.04G.',
      completed: true,
    },
    {
      id: 'WP-4',
      city: 'Dubai DWC Aerotropolis',
      country: 'UAE',
      code: 'DWC',
      type: 'APPROACHING_APRON',
      status: 'CURRENT_POSITION',
      time: '17:05 UTC (Live)',
      x: 640,
      y: 215,
      temp: `${liveTemp}°C`,
      custodian: 'Emirates SkyCargo Ground',
      notes: 'Descent into Dubai airspace. Active compressor report matches SLA range.',
      completed: false,
      current: true,
    },
    {
      id: 'WP-5',
      city: 'Dubai Healthcare City Hub',
      country: 'UAE',
      code: 'DXB-HC',
      type: 'FINAL_DESTINATION',
      status: 'SCHEDULED',
      time: 'Est. 20:30 UTC',
      x: 820,
      y: 260,
      temp: 'Target 2-8°C',
      custodian: 'Dubai Health Authority Reserve',
      notes: 'Receiving dock pre-notified. Temperature log verification pending delivery.',
      completed: false,
    },
  ];

  const activeWp = selectedWaypoint || waypoints[3];
  const isTempSafe =
    liveTemp >= (shipment?.tempRange?.min ?? 2) && liveTemp <= (shipment?.tempRange?.max ?? 8);

  // Approximate plane position calculated from simulationProgress
  // Interpolates between WP-3 (390, 135) and WP-4 (640, 215)
  const planeX = 390 + ((640 - 390) * (simulationProgress - 50)) / 50;
  const planeY = 135 + ((215 - 135) * (simulationProgress - 50)) / 50;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Real-Time Telemetry & Visual GPS Tracking
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive corridor mapping with in-transit vehicle vectoring & waypoint telematics
          </p>
        </div>

        {/* Consignment Selector & WebSocket Ping */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-mono font-bold">
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            <span>WS {wsPing}ms</span>
          </div>

          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setSelectedWaypoint(null);
            }}
            className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400"
          >
            {shipments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.carrier}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── INTERACTIVE VISUAL ROUTE MAP ─── */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-white shadow-xl">
        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/60 shadow-lg">
          <Plane className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div className="text-left">
            <div className="text-[11px] font-black text-white">Flight LX108 Intermodal Vector</div>
            <div className="text-[10px] text-slate-400 font-mono">
              Basel (BSL) &rarr; Dubai (DWC) &bull; Altitude 38,000 ft
            </div>
          </div>
        </div>

        {/* Map Telemetry Beacon Overlay */}
        <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/60 shadow-lg text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-400 font-bold">GPS LOCK</span>
          </div>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">25.0757° N, 55.1888° E</span>
        </div>

        {/* Interactive SVG Canvas */}
        <div className="w-full h-80 sm:h-96 relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 select-none">
          {/* Subtle Grid Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Continent Contour Silhouette (Stylized Europe to Middle East) */}
          <svg
            viewBox="0 0 960 360"
            className="w-full h-full relative z-0"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Simulated Landmass Silhouettes */}
            <path
              d="M 60,60 Q 180,40 280,70 T 480,110 T 700,160 T 900,240 L 920,340 L 40,340 Z"
              fill="#0f172a"
              opacity="0.6"
            />

            {/* Full Planned Flight Corridor Path */}
            <path
              d="M 120,110 Q 260,100 390,135 T 640,215 T 820,260"
              fill="none"
              stroke="#334155"
              strokeWidth="4"
              strokeDasharray="6,6"
            />

            {/* Completed Path Traversed by Cargo with Cyan Glow */}
            <path
              d="M 120,110 Q 260,100 390,135 Q 515,175 640,215"
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="4"
              filter="url(#glow)"
            />

            {/* Moving Aircraft Icon along Vector */}
            <g transform={`translate(${planeX - 14}, ${planeY - 14})`}>
              <circle r="18" cx="14" cy="14" fill="#06b6d4" fillOpacity="0.2" className="animate-ping" />
              <circle r="14" cx="14" cy="14" fill="#0891b2" stroke="#ffffff" strokeWidth="2" />
              <path
                d="M 14,7 L 17,14 L 22,16 L 17,18 L 16,21 L 14,19 L 12,21 L 11,18 L 6,16 L 11,14 Z"
                fill="#ffffff"
                transform="rotate(24 14 14)"
              />
            </g>

            {/* Waypoint Nodes (Clickable SVG elements) */}
            {waypoints.map((wp) => {
              const isSelected = activeWp.id === wp.id;
              return (
                <g
                  key={wp.id}
                  onClick={() => setSelectedWaypoint(wp)}
                  className="cursor-pointer group"
                >
                  {/* Waypoint Ring Pulse if Active */}
                  {wp.current && (
                    <circle
                      cx={wp.x}
                      cy={wp.y}
                      r="16"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      className="animate-ping"
                      opacity="0.75"
                    />
                  )}

                  {/* Outer Click Target Area */}
                  <circle
                    cx={wp.x}
                    cy={wp.y}
                    r={isSelected ? 14 : 10}
                    fill={isSelected ? '#06b6d4' : wp.completed ? '#10b981' : '#1e293b'}
                    stroke={isSelected ? '#ffffff' : '#0f172a'}
                    strokeWidth="3"
                    className="transition-all duration-300"
                  />

                  {/* Inner Node Core */}
                  <circle
                    cx={wp.x}
                    cy={wp.y}
                    r="4"
                    fill={wp.completed || isSelected ? '#ffffff' : '#64748b'}
                  />

                  {/* City Label Tag Below Node */}
                  <text
                    x={wp.x}
                    y={wp.y + 24}
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="font-mono select-none"
                  >
                    {wp.code}
                  </text>
                  <text
                    x={wp.x}
                    y={wp.y + 36}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    className="select-none"
                  >
                    {wp.city.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Waypoint Popup Card Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {activeWp.city}, {activeWp.country}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700 font-bold">
                    {activeWp.code} &bull; {activeWp.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {activeWp.notes}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800 text-[11px] font-mono">
              <div className="text-right">
                <div className="text-slate-400">Recorded Temp:</div>
                <div className="font-bold text-cyan-400 text-xs">{activeWp.temp}</div>
              </div>
              <div className="text-right">
                <div className="text-slate-400">Timestamp:</div>
                <div className="font-bold text-white text-xs">{activeWp.time}</div>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-slate-400">Custodian:</div>
                <div className="font-bold text-slate-300 text-xs truncate max-w-[140px]">
                  {activeWp.custodian}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── LIVE TELEMETRY SENSOR STRIP ─── */}
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
            <span
              className={`text-3xl font-black ${
                isTempSafe ? 'text-cyan-600 dark:text-cyan-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
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

      {/* ─── WAYPOINT PROGRESS MILESTONES ─── */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Intermodal Checkpoints & Custody Sequence
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            Click any checkpoint to view telemetry details
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
          {waypoints.map((wp, idx) => (
            <div
              key={wp.id}
              onClick={() => setSelectedWaypoint(wp)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                activeWp.id === wp.id
                  ? 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-500 shadow-md shadow-cyan-500/10 ring-2 ring-cyan-500/30'
                  : wp.completed
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
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
              <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mt-2 font-bold flex items-center justify-between">
                <span>{wp.time}</span>
                <span>{wp.code}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { GpsRouteViewer as LiveTracking, GpsRouteViewer as TrackingCard };

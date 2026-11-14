import React, { useState } from 'react';
import { useShipments } from '../../context/ShipmentContext';
import {
  X,
  Truck,
  Building2,
  MapPin,
  Calendar,
  AlertTriangle,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export default function CreateShipmentModal() {
  const { isCreateOpen, setIsCreateOpen, createShipment } = useShipments();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pharmaceutical');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [carrier, setCarrier] = useState('');
  const [tempMin, setTempMin] = useState(2);
  const [tempMax, setTempMax] = useState(8);
  const [eta, setEta] = useState('');
  const [notes, setNotes] = useState('');

  if (!isCreateOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !origin || !destination || !carrier) return;

    createShipment({
      title,
      category,
      origin,
      destination,
      carrier,
      tempMin: parseFloat(tempMin),
      tempMax: parseFloat(tempMax),
      eta: eta || '2026-11-18 18:00 UTC',
      notes,
    });

    // Reset and close
    setTitle('');
    setOrigin('');
    setDestination('');
    setCarrier('');
    setNotes('');
    setIsCreateOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <PlusCircle className="w-6 h-6 text-cyan-200" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Register New Tracked Shipment</h2>
              <p className="text-xs text-cyan-100 font-medium">
                Generates Cryptographic Genesis Block #0 with Immutable SHA-256 Anchor
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Shipment / Cargo Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Temperature-Sensitive mRNA Vaccines Batch B-99"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Cargo Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              >
                <option value="Pharmaceutical">Pharmaceutical (Cold-Chain)</option>
                <option value="Perishable Produce">Perishable Produce</option>
                <option value="Aerospace Electronics">Aerospace Electronics</option>
                <option value="Semiconductor Wafers">Semiconductor Wafers</option>
                <option value="High-Value Luxury">High-Value Luxury</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Origin Logistics Node
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Novartis Basel Hub, Switzerland"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Destination Node
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Dubai Healthcare City, UAE"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Primary Carrier / Transporter
              </label>
              <div className="relative">
                <Truck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. Swiss WorldCargo / Emirates SkyCargo"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Estimated Delivery (ETA)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  placeholder="e.g. 2026-11-17 19:30 UTC"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Temperature Range SLA */}
          <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-900 dark:text-cyan-300 uppercase tracking-wider">
                Thermal SLA Bounds (°C)
              </span>
              <span className="text-xs text-cyan-700 dark:text-cyan-400 font-semibold">
                Permitted Range: {tempMin}°C to {tempMax}°C
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Min Allowed Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={tempMin}
                  onChange={(e) => setTempMin(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Max Allowed Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={tempMax}
                  onChange={(e) => setTempMax(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Handling & Chain-of-Custody Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Continuous active compressor refrigeration required. Log shock telemetry upon air cargo apron handover."
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Cryptographic Assurance Banner */}
          <div className="p-3 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>
              Genesis Block #0 will be initialized with null parent hash and signed via your session key.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Initialize & Anchor Genesis Block</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

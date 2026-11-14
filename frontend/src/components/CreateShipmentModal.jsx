import React, { useState } from 'react';
import { useShipments } from '../context/ShipmentContext';
import {
  X,
  PackagePlus,
  ShieldCheck,
  Truck,
  MapPin,
  Thermometer,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function CreateShipmentModal() {
  const { isCreateOpen, setIsCreateOpen, createShipment } = useShipments();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Biopharma / Cold Chain',
    origin: '',
    destination: '',
    carrier: 'AeroCold Global',
    custodian: '',
    tempMin: '2.0',
    tempMax: '8.0',
    shockMax: '0.2',
    description: '',
  });

  if (!isCreateOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.origin || !formData.destination) return;
    createShipment(formData);
  };

  // Quick preset loader for hackathon judges
  const handleLoadPreset = (type) => {
    if (type === 'biopharma') {
      setFormData({
        title: 'Messenger RNA Vaccine Batch #409',
        category: 'Biopharma / Cold Chain',
        origin: 'Zurich Bio-Tech Center, Switzerland',
        destination: 'King Fahd Medical City, Riyadh',
        carrier: 'AeroCold Global',
        custodian: 'Novartis Biologics AG',
        tempMin: '2.0',
        tempMax: '8.0',
        shockMax: '0.15',
        description: 'Ultra-sensitive mRNA vaccine containers requiring continuous thermal auditing.',
      });
    } else if (type === 'semiconductor') {
      setFormData({
        title: 'AI Accelerator ASICs (3nm Lot)',
        category: 'High-Value Electronics',
        origin: 'Tainan Fab 18, Taiwan',
        destination: 'Frankfurt Data Cluster, Germany',
        carrier: 'Pacific Freight Express',
        custodian: 'TSMC Global Freight Division',
        tempMin: '18.0',
        tempMax: '24.0',
        shockMax: '0.1',
        description: 'Next-gen silicon accelerators in sealed nitrogen-purged shock canisters.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-600/20">
              <PackagePlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Register New Provenance Shipment
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Initializes Genesis Block #0 with verifiable SHA-256 cryptographic proof
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Quick presets for Hackathon demo */}
          <div className="p-3 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-800 dark:text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>Load Hackathon Demo Template:</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleLoadPreset('biopharma')}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 shadow-xs"
              >
                Cold Biopharma
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('semiconductor')}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 shadow-xs"
              >
                Semiconductor ASIC
              </button>
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shipment Cargo Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. mRNA Vaccine Cold Consignment"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cargo Classification
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="Biopharma / Cold Chain">Biopharma / Cold Chain</option>
                <option value="High-Value Electronics">High-Value Electronics</option>
                <option value="Perishable Agriculture">Perishable Agriculture</option>
                <option value="Aerospace Precision Gear">Aerospace Precision Gear</option>
                <option value="General High-Security Freight">General High-Security Freight</option>
              </select>
            </div>
          </div>

          {/* Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Origin Hub & Country *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Basel Logistics Facility, Switzerland"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Destination Terminal & Country *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dubai Health Hub, UAE"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Carrier & Custodian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                Primary Carrier Partner
              </label>
              <select
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="AeroCold Global">AeroCold Global (Cold Chain Tier 1)</option>
                <option value="Swiss WorldCargo AG">Swiss WorldCargo AG (Air Cargo Tier 1)</option>
                <option value="Pacific Freight Express">Pacific Freight Express (Intermodal)</option>
                <option value="NorthStar Intermodal">NorthStar Intermodal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Dispatch Custodian
              </label>
              <input
                type="text"
                placeholder="e.g. Novartis Pharma AG Dispatch"
                value={formData.custodian}
                onChange={(e) => setFormData({ ...formData, custodian: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Sensor Thresholds (Temperature & Shock) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              IoT Sensor Contract Thresholds
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-cyan-500" /> Min Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.tempMin}
                  onChange={(e) => setFormData({ ...formData, tempMin: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-rose-500" /> Max Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.tempMax}
                  onChange={(e) => setFormData({ ...formData, tempMax: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Max Shock (G)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={formData.shockMax}
                  onChange={(e) => setFormData({ ...formData, shockMax: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Payload Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Consignment Payload & Manifest Details
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Multi-sensor GPS dataloggers attached. Sealed container seal #SEAL-902-DXB."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Seal Genesis Block & Initialize Provenance Chain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

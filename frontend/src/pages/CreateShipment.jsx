import React from 'react';
import CreateShipmentModal from '../components/shipments/CreateShipmentModal';
import { useShipments } from '../context/ShipmentContext';
import { PlusCircle, ArrowLeft } from 'lucide-react';

export default function CreateShipment() {
  const { setIsCreateOpen } = useShipments();

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Create New Tracked Consignment</h2>
          <p className="text-xs text-slate-500">Initialize Genesis Block #0 with cryptographic SHA-256 seal</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-cyan-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Open Creation Form</span>
        </button>
      </div>
      <CreateShipmentModal />
    </div>
  );
}

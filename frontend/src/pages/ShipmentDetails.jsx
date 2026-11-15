import React from 'react';
import ShipmentDetailsModal from '../components/shipments/ShipmentDetailsModal';
import { useShipments } from '../context/ShipmentContext';
import { Truck } from 'lucide-react';

export default function ShipmentDetails() {
  const { selectedShipment } = useShipments();

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Shipment Inspection Dossier</h2>
        <p className="text-xs text-slate-500">Inspection & Cryptographic Audit for {selectedShipment?.id}</p>
      </div>
      <ShipmentDetailsModal />
    </div>
  );
}

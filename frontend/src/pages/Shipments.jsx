import React from 'react';
import ShipmentStatusChart from '../components/dashboard/ShipmentStatusChart';
import ShipmentTable from '../components/shipments/ShipmentTable';

export default function Shipments() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <ShipmentStatusChart />
      <ShipmentTable />
    </div>
  );
}

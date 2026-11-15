import React from 'react';
import RiskAlertList from '../components/risks/RiskAlertList';
import ShipmentStatusChart from '../components/dashboard/ShipmentStatusChart';

export default function RiskMonitoring() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <RiskAlertList />
      <ShipmentStatusChart />
    </div>
  );
}

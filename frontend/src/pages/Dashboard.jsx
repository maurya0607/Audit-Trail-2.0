import React from 'react';
import StatsCards from '../components/dashboard/StatCard';
import ShipmentStatusChart from '../components/dashboard/ShipmentStatusChart';
import ShipmentTable from '../components/shipments/ShipmentTable';
import RecentActivity from '../components/dashboard/RecentActivity';
import RiskAlertList from '../components/risks/RiskAlertList';
import MultiPartyDispute from '../components/disputes/MultiPartyDispute';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { canAccessTab } = useAuth();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 4 Key Performance Metrics with Sparklines */}
      <StatsCards />

      {/* Shipment Status & SLA Progress Matrix */}
      <ShipmentStatusChart />

      {/* Active Freight Consignments & Tracking */}
      <div className="grid grid-cols-1 gap-8">
        {canAccessTab('shipments') && <ShipmentTable />}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivity />
          {canAccessTab('risks') && <RiskAlertList />}
        </div>
      </div>

      {/* Tripartite Dispute Resolution Center */}
      {canAccessTab('disputes') && <MultiPartyDispute />}
    </div>
  );
}

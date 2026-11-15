import React, { useState } from 'react';
import StatsCards from '../components/dashboard/StatCard';
import ShipmentStatusChart from '../components/dashboard/ShipmentStatusChart';
import ShipmentTable from '../components/shipments/ShipmentTable';
import RecentActivity from '../components/dashboard/RecentActivity';
import RiskAlertList from '../components/risks/RiskAlertList';
import MultiPartyDispute from '../components/disputes/MultiPartyDispute';
import { useAuth, ROLE_METADATA, ROLES } from '../context/AuthContext';
import {
  ShieldCheck,
  Building2,
  Truck,
  CheckCircle2,
  FileCheck,
  Activity,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

const ROLE_ICONS = {
  ADMIN: ShieldCheck,
  LOGISTICS_MANAGER: Activity,
  SUPPLIER: Building2,
  TRANSPORTER: Truck,
  RECEIVER: CheckCircle2,
  AUDITOR: FileCheck,
};

export default function Dashboard() {
  const { user, canAccessTab } = useAuth();
  const currentRole = user?.role || ROLES.ADMIN;
  const roleMeta = ROLE_METADATA[currentRole];
  const RoleIcon = ROLE_ICONS[currentRole] || ShieldCheck;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 4 Key Performance Metrics with Sparklines (Role Contextualized) */}
      <StatsCards />

      {/* Shipment Status & SLA Progress Matrix (Shown for Admin, Manager, Transporter, Auditor) */}
      {(currentRole === ROLES.ADMIN ||
        currentRole === ROLES.LOGISTICS_MANAGER ||
        currentRole === ROLES.TRANSPORTER ||
        currentRole === ROLES.AUDITOR) && (
        <ShipmentStatusChart />
      )}

      {/* Active Freight Consignments & Tracking */}
      <div className="grid grid-cols-1 gap-8">
        {canAccessTab('shipments') && <ShipmentTable />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivity />
          {canAccessTab('risks') && <RiskAlertList />}
        </div>
      </div>

      {/* Multi-Party Dispute Resolution Center */}
      {canAccessTab('disputes') && <MultiPartyDispute />}
    </div>
  );
}

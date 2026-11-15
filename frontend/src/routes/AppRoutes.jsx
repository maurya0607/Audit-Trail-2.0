import React from 'react';
import Dashboard from '../pages/Dashboard';
import Shipments from '../pages/Shipments';
import LiveTracking from '../pages/LiveTracking';
import Disputes from '../pages/Disputes';
import EvidenceManagement from '../pages/EvidenceManagement';
import RiskMonitoring from '../pages/RiskMonitoring';
import EventLedger from '../pages/EventLedger';
import EventReplay from '../pages/EventReplay';
import AuditReports from '../pages/AuditReports';
import UserProfile from '../pages/UserProfile';
import ProfileEdit from '../pages/ProfileEdit';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function AppRoutes({ activeTab, setActiveTab }) {
  const { canAccessTab, user } = useAuth();

  // 'profile' is always accessible by any logged-in user – bypass the tab-guard
  const isPublicTab = activeTab === 'profile';

  if (!isPublicTab && activeTab !== 'dashboard' && !canAccessTab(activeTab)) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 max-w-md mx-auto">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Unauthorized Module Access
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your current role (<strong>{user?.role}</strong>) does not have cryptographic authorization to view the <code>/{activeTab}</code> module.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="py-1.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-xs"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  switch (activeTab) {
    case 'dashboard':
      return <Dashboard />;
    case 'shipments':
      return <Shipments />;
    case 'tracking':
      return <LiveTracking />;
    case 'disputes':
      return <Disputes />;
    case 'evidence':
      return <EvidenceManagement />;
    case 'risks':
      return <RiskMonitoring />;
    case 'ledger':
      return <EventLedger />;
    case 'replay':
      return <EventReplay />;
    case 'reports':
      return <AuditReports />;
    case 'profile':
      return <ProfileEdit setActiveTab={setActiveTab} />;
    case 'profile-view':
      return <UserProfile />;
    default:
      return <Dashboard />;
  }
}

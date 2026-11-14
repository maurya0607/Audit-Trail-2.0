import React from 'react';
import HashChainViewer from '../components/ledger/HashChainViewer';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function EventLedger() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <HashChainViewer />
      <RecentActivity />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth, ROLE_METADATA, ROLES } from './context/AuthContext';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import ShipmentTracker from './components/ShipmentTracker';
import AuditLedger from './components/AuditLedger';
import RiskAlerts from './components/RiskAlerts';
import DisputeDesk from './components/DisputeDesk';
import AuthModal from './components/AuthModal';
import {
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Sparkles,
  Lock,
  ShieldAlert,
} from 'lucide-react';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const { user, switchRole, canAccessTab, isAuthModalOpen, setIsAuthModalOpen } = useAuth();

  // Dark / Light Mode state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('audit_trail_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('audit_trail_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('audit_trail_theme', 'light');
    }
  }, [isDark]);

  // If user role changes and current tab is no longer permitted, redirect to dashboard
  useEffect(() => {
    if (activeTab !== 'dashboard' && !canAccessTab(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [user?.role, activeTab]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleSelectShipment = (shipment) => {
    setSelectedShipment(shipment);
    if (canAccessTab('ledger')) {
      setActiveTab('ledger');
    }
  };

  const currentRoleMeta = user ? ROLE_METADATA[user.role] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/40 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-[11px] font-semibold text-cyan-800 dark:text-cyan-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                Enterprise Provenance Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Logistics Auditing & Dispute Arbitration
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Continuous IoT telemetry tracking, cryptographic SHA-256 event chaining, anomaly risk detection, and automated non-repudiable claim settlement.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                Vite + React + Tailwind
              </span>
              {canAccessTab('ledger') && (
                <button
                  onClick={() => setActiveTab('ledger')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 transition-all"
                >
                  <span>Inspect Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Role-Based Authority Strip (Hackathon Judge Showcase) */}
        {user && currentRoleMeta && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentRoleMeta.badgeColor}`}
                  >
                    {currentRoleMeta.label}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    ({user.organization})
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentRoleMeta.description}
                </p>
              </div>
            </div>

            {/* 1-Click Role Switcher for Hackathon Testing */}
            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline">
                Demo Switch:
              </span>
              {[
                { role: ROLES.AUDITOR, short: 'Auditor' },
                { role: ROLES.CARRIER, short: 'Carrier' },
                { role: ROLES.CONSIGNEE, short: 'Consignee' },
                { role: ROLES.ADMIN, short: 'Admin' },
              ].map((r) => (
                <button
                  key={r.role}
                  onClick={() => switchRole(r.role)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    user.role === r.role
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {r.short}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Global KPI Metrics Cards */}
        <StatsCards />

        {/* Dynamic Views based on active tab and role permissions */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {canAccessTab('shipments') ? (
              <ShipmentTracker onSelectShipment={handleSelectShipment} />
            ) : (
              <AuditLedger />
            )}
            <div className="space-y-8">
              {canAccessTab('risks') && <RiskAlerts />}
              {canAccessTab('disputes') && <DisputeDesk />}
              {!canAccessTab('disputes') && canAccessTab('ledger') && <AuditLedger />}
            </div>
          </div>
        )}

        {activeTab === 'shipments' && canAccessTab('shipments') && (
          <ShipmentTracker onSelectShipment={handleSelectShipment} />
        )}

        {activeTab === 'ledger' && canAccessTab('ledger') && (
          <AuditLedger />
        )}

        {activeTab === 'risks' && canAccessTab('risks') && (
          <RiskAlerts />
        )}

        {activeTab === 'disputes' && canAccessTab('disputes') && (
          <DisputeDesk />
        )}
      </main>

      {/* Authentication & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white/50 dark:bg-slate-950/80 py-6 text-center text-xs text-slate-500 dark:text-slate-500 transition-colors">
        Audit-Trail 2.0 &bull; Role-Based Cryptographic Access &bull; HackDay 2026
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}

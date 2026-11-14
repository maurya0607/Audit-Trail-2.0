import React, { useState, useRef, useEffect } from 'react';
import { useAuth, ROLE_METADATA, ROLES } from '../context/AuthContext';
import {
  ShieldCheck,
  Activity,
  Cpu,
  AlertTriangle,
  FileText,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Lock,
  Layers,
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isDark, toggleTheme }) {
  const { user, logout, switchRole, canAccessTab, setIsAuthModalOpen } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allTabs = [
    { id: 'dashboard', label: 'Live Overview', icon: Activity },
    { id: 'shipments', label: 'Shipments', icon: ShieldCheck },
    { id: 'ledger', label: 'Audit Trail Ledger', icon: Cpu },
    { id: 'risks', label: 'AI Risk Monitor', icon: AlertTriangle },
    { id: 'disputes', label: 'Dispute Desk', icon: FileText },
  ];

  // Dynamic role-based navigation filtering
  const visibleTabs = allTabs.filter((t) => canAccessTab(t.id));

  const roleMeta = user ? ROLE_METADATA[user.role] : null;

  return (
    <header className="border-b border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95 backdrop-blur sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  Audit-Trail
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                  2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                AI Logistics & Cryptographic Provenance
              </p>
            </div>
          </div>

          {/* Dynamic Role-Based Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SHA-256 Status Pill */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400">
                LEDGER ACTIVE
              </span>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark and Light Mode"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm shrink-0"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* User Profile & Role Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-600/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[110px]">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[110px]">
                      {roleMeta?.label}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 animate-fadeIn">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {user.name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${roleMeta?.badgeColor}`}
                        >
                          {roleMeta?.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                        {user.email}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                        Org: {user.organization}
                      </div>
                    </div>

                    {/* Quick Role Switcher for Hackathon Judges */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-cyan-500" />
                          <span>Switch Role (Live Demo)</span>
                        </span>
                      </div>
                      {[
                        { role: ROLES.AUDITOR, label: 'Compliance Auditor' },
                        { role: ROLES.CARRIER, label: 'Logistics Carrier' },
                        { role: ROLES.CONSIGNEE, label: 'Cargo Consignee' },
                        { role: ROLES.ADMIN, label: 'Platform Admin' },
                      ].map((r) => (
                        <button
                          key={r.role}
                          onClick={() => {
                            switchRole(r.role);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                            user.role === r.role
                              ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>{r.label}</span>
                          {user.role === r.role && (
                            <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                              Active
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsAuthModalOpen(true);
                        }}
                        className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 py-1 px-2"
                      >
                        Change Account
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all shrink-0"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dynamic Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-200 dark:border-slate-800 no-scrollbar">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-cyan-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

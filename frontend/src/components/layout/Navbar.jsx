import React, { useState, useRef, useEffect } from 'react';
import { useAuth, ROLE_METADATA, ROLES, DEMO_USERS } from '../../context/AuthContext';
import {
  ShieldCheck,
  Activity,
  Cpu,
  AlertTriangle,
  Scale,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Lock,
  Navigation,
  FileText,
  RotateCcw,
  FileCheck,
  Truck,
  Menu,
  X,
  ArrowRight,
  Building2,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  UserPlus,
} from 'lucide-react';

const ROLE_ICONS = {
  ADMIN: ShieldCheck,
  LOGISTICS_MANAGER: Activity,
  SUPPLIER: Building2,
  TRANSPORTER: Truck,
  RECEIVER: CheckCircle2,
  AUDITOR: FileCheck,
};

const ROLE_COLORS = {
  ADMIN: {
    ring: 'ring-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    icon: 'text-amber-600 dark:text-amber-400',
    btn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20',
  },
  LOGISTICS_MANAGER: {
    ring: 'ring-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    icon: 'text-rose-600 dark:text-rose-400',
    btn: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20',
  },
  SUPPLIER: {
    ring: 'ring-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    icon: 'text-blue-600 dark:text-blue-400',
    btn: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20',
  },
  TRANSPORTER: {
    ring: 'ring-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    icon: 'text-emerald-600 dark:text-emerald-400',
    btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20',
  },
  RECEIVER: {
    ring: 'ring-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    icon: 'text-purple-600 dark:text-purple-400',
    btn: 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20',
  },
  AUDITOR: {
    ring: 'ring-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-500/10',
    icon: 'text-cyan-600 dark:text-cyan-400',
    btn: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/20',
  },
};

// ─── Professional Unified Auth Modal with Role Dropdown ────────────────────────
function AuthModal({ isOpen, onClose }) {
  const { login, register, switchRole } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN);
  const [showPassword, setShowPassword] = useState(false);

  // Form input states (Clean professional inputs with placeholders, no hardcoded auto-fill)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');

  // Handle role selection without overriding user-typed credentials
  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
  };

  // Keep form inputs clean on modal open
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setOrganization('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const roleMeta = ROLE_METADATA[selectedRole];
  const roleColor = ROLE_COLORS[selectedRole];
  const RoleIcon = ROLE_ICONS[selectedRole];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      login(email, password, selectedRole);
    } else {
      register({
        name: name || email.split('@')[0],
        email,
        password,
        role: selectedRole,
        organization: organization || `${roleMeta.label} Entity`,
      });
    }
    onClose();
  };

  const handleQuickDemoClick = (roleKey) => {
    switchRole(roleKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">
                  Audit Trail 2.0 Identity Portal
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Role-Based
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {mode === 'login' ? 'Sign in with your selected role' : 'Create new participant account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-6 pt-3 shrink-0">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              mode === 'login'
                ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              mode === 'signup'
                ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up (Register)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Main Role Dropdown Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Select Your Role</span>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold lowercase">
                *defines data access boundary
              </span>
            </label>

            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 appearance-none cursor-pointer"
              >
                <option value={ROLES.ADMIN}>1. Admin (Full Unrestricted Master Platform View)</option>
                <option value={ROLES.LOGISTICS_MANAGER}>2. Logistics Manager (Dispute Arbitration & Settlements)</option>
                <option value={ROLES.SUPPLIER}>3. Supplier (Outbound Dispatches & Invoices)</option>
                <option value={ROLES.TRANSPORTER}>4. Transporter (Assigned Carrier Fleet & Telemetry)</option>
                <option value={ROLES.RECEIVER}>5. Receiver (Inbound Consignee Receiving & Shortages)</option>
                <option value={ROLES.AUDITOR}>6. Auditor (Cryptographic Verification & Reports)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Selected Role Context Card */}
            <div className={`p-3 rounded-xl border mt-2 flex items-start gap-3 ${roleColor.bg} border-current/20`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-current/20 ${roleColor.bg}`}>
                <RoleIcon className={`w-4 h-4 ${roleColor.icon}`} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black ${roleColor.icon}`}>{roleMeta.label}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${roleMeta.badgeColor}`}>
                    Active Selection
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {roleMeta.scopeSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Name & Organization inputs for Signup */}
          {mode === 'signup' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vishal Maurya"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <select
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="">Select Organization Entity...</option>
                    <optgroup label="Platform & Regulatory">
                      <option value="Audit-Trail 2.0 Global Operations">Audit-Trail 2.0 Global Operations</option>
                      <option value="Maritime Compliance & Biopharma Audit Bureau">Maritime Compliance & Biopharma Audit Bureau</option>
                      <option value="Global Logistics Standards Council">Global Logistics Standards Council</option>
                    </optgroup>
                    <optgroup label="Suppliers & Manufacturers">
                      <option value="Novartis Pharma AG">Novartis Pharma AG (Basel Bio Hub)</option>
                      <option value="Pfizer BioLogistics Global">Pfizer BioLogistics Global</option>
                      <option value="FreshMart Organics Supply Co.">FreshMart Organics Supply Co.</option>
                    </optgroup>
                    <optgroup label="Carriers & Freight Transporters">
                      <option value="Swiss WorldCargo AG">Swiss WorldCargo AG</option>
                      <option value="AeroCold Global Logistics">AeroCold Global Logistics</option>
                      <option value="DHL Global Cold-Chain Express">DHL Global Cold-Chain Express</option>
                      <option value="Emirates SkyCargo Freight">Emirates SkyCargo Freight</option>
                    </optgroup>
                    <optgroup label="Consignees & Receiving Hubs">
                      <option value="Dubai Health Hub Central Depot">Dubai Health Hub Central Depot</option>
                      <option value="Berlin Charite Clinical Reserves">Berlin Charite Clinical Reserves</option>
                      <option value="MetroHealth Regional Hospital Network">MetroHealth Regional Hospital Network</option>
                    </optgroup>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@organization.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 ${roleColor.btn} text-white font-bold rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2`}
          >
            {mode === 'login' ? <Lock className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>
              {mode === 'login'
                ? `Sign In as ${roleMeta.label}`
                : `Complete Sign Up as ${roleMeta.label}`}
            </span>
          </button>

          {/* Quick Demo Switcher Strip for Hackathon Judges */}
          {mode === 'login' && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Demo Quick-Fill:</span>
                </span>
                <span className="text-[10px] text-slate-400">click to load credentials</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { role: ROLES.ADMIN, label: 'Admin' },
                  { role: ROLES.LOGISTICS_MANAGER, label: 'Manager' },
                  { role: ROLES.SUPPLIER, label: 'Supplier' },
                  { role: ROLES.TRANSPORTER, label: 'Transporter' },
                  { role: ROLES.RECEIVER, label: 'Receiver' },
                  { role: ROLES.AUDITOR, label: 'Auditor' },
                ].map((r) => {
                  const isSelected = selectedRole === r.role;
                  const meta = ROLE_METADATA[r.role];
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => {
                        setSelectedRole(r.role);
                        const demo = DEMO_USERS.find((u) => u.role === r.role);
                        if (demo) {
                          setEmail(demo.email);
                          setPassword(demo.password || 'password123');
                        }
                      }}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all truncate text-center ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-cyan-500/20 dark:text-cyan-300 border-cyan-500'
                          : `${meta.badgeColor} hover:opacity-80`
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// ─── Main Professional Navbar ─────────────────────────────────────────────────
export default function Navbar({ activeTab, setActiveTab, isDark, toggleTheme }) {
  const { user, logout, switchRole, canAccessTab, isAuthModalOpen, setIsAuthModalOpen } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'shipments', label: 'Shipments', icon: Truck },
    { id: 'tracking', label: 'Live Tracking', icon: Navigation },
    { id: 'disputes', label: 'Disputes & AI', icon: Scale },
    { id: 'evidence', label: 'Evidence', icon: FileText },
    { id: 'risks', label: 'Risk Monitor', icon: AlertTriangle },
    { id: 'ledger', label: 'Hash Ledger', icon: Cpu },
    { id: 'replay', label: 'Event Replay', icon: RotateCcw },
    { id: 'reports', label: 'Audit Reports', icon: FileCheck },
  ];

  const visibleTabs = allTabs.filter((t) => canAccessTab(t.id));
  const roleMeta = user ? ROLE_METADATA[user.role] : null;
  const roleColor = user ? ROLE_COLORS[user.role] : null;
  const RoleIcon = user ? ROLE_ICONS[user.role] : null;

  return (
    <>
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-md shadow-cyan-500/30">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
                    Audit-Trail
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-cyan-600 text-white">
                    2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block leading-none">
                  AI Logistics Provenance
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs (Filtered per role) */}
            <nav className="hidden lg:flex flex-1 items-center justify-center">
              <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 overflow-x-auto no-scrollbar">
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'
                        }`}
                      />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Right Action Area */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Dark and Light Mode"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User Dropdown / Login button */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border-2 transition-all ${roleColor?.ring} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-current`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${roleColor?.bg} shrink-0`}
                    >
                      {RoleIcon && <RoleIcon className={`w-4 h-4 ${roleColor?.icon}`} />}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[90px]">
                        {user.name}
                      </div>
                      <div className={`text-[9px] font-bold leading-none ${roleColor?.icon}`}>
                        {roleMeta?.label}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn">
                      {/* Current User Card */}
                      <div className={`p-3 rounded-xl mb-3 ${roleColor?.bg} border border-current/20`}>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${roleColor?.bg} border border-current/20`}
                          >
                            {RoleIcon && <RoleIcon className={`w-5 h-5 ${roleColor?.icon}`} />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                              {user.name}
                            </div>
                            <div className={`text-[10px] font-bold ${roleColor?.icon}`}>
                              {roleMeta?.label}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Role Switcher Grid (Strictly available ONLY to Platform Admin) */}
                      {user.role === ROLES.ADMIN ? (
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5 px-1 mb-2">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Admin Switch Role Authority
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {Object.values(ROLES).map((role) => {
                              const meta = ROLE_METADATA[role];
                              const color = ROLE_COLORS[role];
                              const Icon2 = ROLE_ICONS[role];
                              const isCurrentRole = user.role === role;

                              return (
                                <button
                                  key={role}
                                  onClick={() => {
                                    switchRole(role);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all border ${
                                    isCurrentRole
                                      ? `${color.bg} border-current/30`
                                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800'
                                  }`}
                                >
                                  <Icon2 className={`w-3.5 h-3.5 shrink-0 ${color.icon}`} />
                                  <div className="min-w-0">
                                    <div
                                      className={`text-[10px] font-bold truncate ${
                                        isCurrentRole ? color.icon : 'text-slate-700 dark:text-slate-300'
                                      }`}
                                    >
                                      {meta.label}
                                    </div>
                                  </div>
                                  {isCurrentRole && (
                                    <CheckCircle2
                                      className={`w-3 h-3 ml-auto shrink-0 ${color.icon}`}
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        /* Non-admin users: Role is locked and bound to their organization */
                        <div className="mb-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                            Role Boundary: <strong className="text-slate-800 dark:text-slate-200">{roleMeta?.label} Scope</strong>
                          </span>
                        </div>
                      )}

                      {/* Dropdown Action Buttons */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setActiveTab('profile');
                          }}
                          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 px-2 py-1 transition-colors"
                        >
                          Profile Settings
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Unauthenticated View: Sign In & Enroll */
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Sign In / Register</span>
                  </button>
                </div>
              )}

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-1 animate-fadeIn">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              {!user && (
                <div className="pt-2 flex gap-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold"
                  >
                    Sign In / Register Role
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal connected to context */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

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

// ─── Role Icon mapping ───────────────────────────────────────────────────────
const ROLE_ICONS = {
  ADMIN: ShieldCheck,
  SUPPLIER: Building2,
  TRANSPORTER: Truck,
  RECEIVER: CheckCircle2,
  AUDITOR: FileCheck,
  LOGISTICS_MANAGER: Activity,
};

const ROLE_COLORS = {
  ADMIN:             { ring: 'ring-amber-400',    bg: 'bg-amber-50 dark:bg-amber-500/10',    icon: 'text-amber-600 dark:text-amber-400',    btn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'  },
  SUPPLIER:          { ring: 'ring-blue-400',     bg: 'bg-blue-50 dark:bg-blue-500/10',      icon: 'text-blue-600 dark:text-blue-400',      btn: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'    },
  TRANSPORTER:       { ring: 'ring-emerald-400',  bg: 'bg-emerald-50 dark:bg-emerald-500/10',icon: 'text-emerald-600 dark:text-emerald-400',btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'},
  RECEIVER:          { ring: 'ring-purple-400',   bg: 'bg-purple-50 dark:bg-purple-500/10',  icon: 'text-purple-600 dark:text-purple-400',  btn: 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'},
  AUDITOR:           { ring: 'ring-cyan-400',     bg: 'bg-cyan-50 dark:bg-cyan-500/10',      icon: 'text-cyan-600 dark:text-cyan-400',      btn: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/20'    },
  LOGISTICS_MANAGER: { ring: 'ring-rose-400',     bg: 'bg-rose-50 dark:bg-rose-500/10',      icon: 'text-rose-600 dark:text-rose-400',      btn: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'    },
};

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal({ isOpen, onClose }) {
  const { login, register, switchRole } = useAuth();

  const [screen, setScreen] = useState('role-select'); // 'role-select' | 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupOrg, setSignupOrg] = useState('');
  const [signupPass, setSignupPass] = useState('');

  const reset = () => {
    setScreen('role-select');
    setSelectedRole(null);
    setLoginEmail('');
    setLoginPass('');
    setSignupName('');
    setSignupEmail('');
    setSignupOrg('');
    setSignupPass('');
  };

  if (!isOpen) return null;

  const roleMeta  = selectedRole ? ROLE_METADATA[selectedRole] : null;
  const roleColor = selectedRole ? ROLE_COLORS[selectedRole]   : null;
  const RoleIcon  = selectedRole ? ROLE_ICONS[selectedRole]    : null;

  const handleLogin = (e) => {
    e.preventDefault();
    login(loginEmail, loginPass);
    reset();
    onClose();
  };

  const handleSignup = (e) => {
    e.preventDefault();
    register({ name: signupName, email: signupEmail, role: selectedRole, organization: signupOrg });
    reset();
    onClose();
  };

  const handleDemoLogin = (role) => {
    const demo = DEMO_USERS.find(u => u.role === role);
    if (demo) switchRole(role);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">

        {/* ── Modal Header ── */}
        <div className="relative px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-md shadow-cyan-600/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                {screen === 'role-select' ? 'Select Your Role to Continue' :
                 screen === 'login'       ? `Sign In — ${roleMeta?.label}` :
                                           `Create Account — ${roleMeta?.label}`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audit Trail 2.0 · Cryptographic Logistics Platform
              </p>
            </div>
          </div>
          <button
            onClick={() => { reset(); onClose(); }}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 overflow-y-auto">

          {/* STEP 1: Role Selector */}
          {screen === 'role-select' && (
            <div className="space-y-5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center">
                Choose the role that matches your identity in the logistics chain
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.values(ROLES).map((role) => {
                  const meta   = ROLE_METADATA[role];
                  const color  = ROLE_COLORS[role];
                  const Icon   = ROLE_ICONS[role];
                  const demo   = DEMO_USERS.find(u => u.role === role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => { setSelectedRole(role); setScreen('login'); }}
                      className={`group p-4 rounded-2xl border-2 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${color.bg} border-slate-200 dark:border-slate-700 hover:${color.ring} hover:border-current`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color.bg} border border-current/20`}>
                        <Icon className={`w-5 h-5 ${color.icon}`} />
                      </div>
                      <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                        {meta.label}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {meta.description}
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all">
                        <span className={color.icon}>Select Role</span>
                        <ArrowRight className={`w-3 h-3 ${color.icon}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Demo Strip */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    1-Click Hackathon Demo Access
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.values(ROLES).map((role) => {
                    const meta  = ROLE_METADATA[role];
                    const color = ROLE_COLORS[role];
                    return (
                      <button
                        key={role}
                        onClick={() => handleDemoLogin(role)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${meta.badgeColor} hover:opacity-80`}
                      >
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2a: Login Form */}
          {screen === 'login' && selectedRole && (
            <div className="space-y-5">
              {/* Role badge */}
              <div className={`flex items-center gap-3 p-4 rounded-2xl border ${roleColor.bg} border-current/20`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${roleColor.bg} border border-current/20`}>
                  <RoleIcon className={`w-5 h-5 ${roleColor.icon}`} />
                </div>
                <div>
                  <div className={`text-xs font-black ${roleColor.icon}`}>{roleMeta.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{roleMeta.description}</div>
                </div>
                <button
                  onClick={() => setScreen('role-select')}
                  className="ml-auto text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors underline"
                >
                  Change Role
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder={DEMO_USERS.find(u => u.role === selectedRole)?.email || 'your@organization.com'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Password / Passkey
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPass}
                      onChange={e => setLoginPass(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 ${roleColor.btn} text-white font-bold rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In as {roleMeta.label}</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  <span>or</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>

                {/* Demo Quick Login */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin(selectedRole)}
                  className={`w-full py-2.5 border-2 border-dashed rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${roleColor.bg} border-current/30`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${roleColor.icon}`} />
                  <span className={roleColor.icon}>Demo: Sign In as {DEMO_USERS.find(u => u.role === selectedRole)?.name}</span>
                </button>

                <p className="text-center text-xs text-slate-500">
                  New user?{' '}
                  <button
                    type="button"
                    onClick={() => setScreen('signup')}
                    className={`font-bold ${roleColor.icon} hover:underline`}
                  >
                    Create Account
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* STEP 2b: Signup Form */}
          {screen === 'signup' && selectedRole && (
            <div className="space-y-5">
              {/* Role badge */}
              <div className={`flex items-center gap-3 p-4 rounded-2xl border ${roleColor.bg} border-current/20`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${roleColor.bg} border border-current/20`}>
                  <RoleIcon className={`w-5 h-5 ${roleColor.icon}`} />
                </div>
                <div>
                  <div className={`text-xs font-black ${roleColor.icon}`}>{roleMeta.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Creating new account</div>
                </div>
                <button
                  onClick={() => setScreen('role-select')}
                  className="ml-auto text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors underline"
                >
                  Change Role
                </button>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={e => setSignupName(e.target.value)}
                        placeholder="e.g. Elena Rostova"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Organization
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={signupOrg}
                        onChange={e => setSignupOrg(e.target.value)}
                        placeholder="e.g. Swiss WorldCargo"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Official Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      placeholder="elena@organization.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Set Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signupPass}
                      onChange={e => setSignupPass(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Permissions Preview */}
                <div className={`p-3 rounded-xl border ${roleColor.bg} border-current/20 space-y-2`}>
                  <div className={`text-[10px] font-black uppercase tracking-wider ${roleColor.icon}`}>
                    Access Permissions for {roleMeta.label}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {roleMeta.allowedTabs.map(tab => (
                      <span key={tab} className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                        /{tab}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 ${roleColor.btn} text-white font-bold rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create {roleMeta.label} Account</span>
                </button>

                <p className="text-center text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setScreen('login')}
                    className={`font-bold ${roleColor.icon} hover:underline`}
                  >
                    Sign In
                  </button>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar({ activeTab, setActiveTab, isDark, toggleTheme }) {
  const { user, logout, switchRole, canAccessTab } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen]   = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen]  = useState(false);
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
    { id: 'dashboard', label: 'Overview',      icon: Activity     },
    { id: 'shipments', label: 'Shipments',     icon: Truck        },
    { id: 'tracking',  label: 'Live Tracking', icon: Navigation   },
    { id: 'disputes',  label: 'Disputes & AI', icon: Scale        },
    { id: 'evidence',  label: 'Evidence',      icon: FileText     },
    { id: 'risks',     label: 'Risk Monitor',  icon: AlertTriangle},
    { id: 'ledger',    label: 'Hash Ledger',   icon: Cpu          },
    { id: 'replay',    label: 'Event Replay',  icon: RotateCcw    },
    { id: 'reports',   label: 'Audit Reports', icon: FileCheck    },
  ];

  const visibleTabs = allTabs.filter(t => canAccessTab(t.id));
  const roleMeta    = user ? ROLE_METADATA[user.role]  : null;
  const roleColor   = user ? ROLE_COLORS[user.role]    : null;
  const RoleIcon    = user ? ROLE_ICONS[user.role]     : null;

  return (
    <>
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* ── Logo ── */}
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

            {/* ── Desktop Nav Tabs ── */}
            <nav className="hidden lg:flex flex-1 items-center justify-center">
              <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 overflow-x-auto no-scrollbar">
                {visibleTabs.map((tab) => {
                  const Icon     = tab.icon;
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
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* ── Right Area ── */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Logged-In User */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border-2 transition-all ${roleColor?.ring} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-current`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${roleColor?.bg} shrink-0`}>
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

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn">
                      {/* Profile card */}
                      <div className={`p-3 rounded-xl mb-3 ${roleColor?.bg} border border-current/20`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${roleColor?.bg} border border-current/20`}>
                            {RoleIcon && <RoleIcon className={`w-5 h-5 ${roleColor?.icon}`} />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black text-slate-900 dark:text-white truncate">{user.name}</div>
                            <div className={`text-[10px] font-bold ${roleColor?.icon}`}>{roleMeta?.label}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{user.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Switch Role section */}
                      <div className="mb-3">
                        <div className="flex items-center gap-1.5 px-1 mb-2">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Switch Role
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {Object.values(ROLES).map(role => {
                            const meta  = ROLE_METADATA[role];
                            const color = ROLE_COLORS[role];
                            const Icon2 = ROLE_ICONS[role];
                            const isCurrentRole = user.role === role;
                            return (
                              <button
                                key={role}
                                onClick={() => { switchRole(role); setIsDropdownOpen(false); }}
                                className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all border ${
                                  isCurrentRole
                                    ? `${color.bg} border-current/30`
                                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800'
                                }`}
                              >
                                <Icon2 className={`w-3.5 h-3.5 shrink-0 ${color.icon}`} />
                                <div className="min-w-0">
                                  <div className={`text-[10px] font-bold truncate ${isCurrentRole ? color.icon : 'text-slate-700 dark:text-slate-300'}`}>
                                    {meta.label}
                                  </div>
                                </div>
                                {isCurrentRole && (
                                  <CheckCircle2 className={`w-3 h-3 ml-auto shrink-0 ${color.icon}`} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => { setIsDropdownOpen(false); setActiveTab('profile'); }}
                          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 px-2 py-1 transition-colors"
                        >
                          Profile Settings
                        </button>
                        <button
                          onClick={() => { logout(); setIsDropdownOpen(false); }}
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
                /* Not logged in — show Sign In + Sign Up buttons */
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Get Access</span>
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ── Mobile Nav Drawer ── */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-1 animate-fadeIn">
              {visibleTabs.map(tab => {
                const Icon     = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
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
                    onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold"
                  >
                    Sign In / Sign Up
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal rendered at Navbar level (self-contained) */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

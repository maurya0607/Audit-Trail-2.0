import React, { useState } from 'react';
import { useAuth, ROLES, DEMO_USERS, ROLE_METADATA } from '../context/AuthContext';
import {
  X,
  Lock,
  Mail,
  User,
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, switchRole } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regRole, setRegRole] = useState(ROLES.AUDITOR);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    login(loginEmail, loginPassword);
    onClose();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regEmail || !regName) return;
    register({
      name: regName,
      email: regEmail,
      role: regRole,
      organization: regOrg,
    });
    onClose();
  };

  const handleQuickDemoLogin = (demoUser) => {
    switchRole(demoUser.role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all">
        {/* Header bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center shadow-md shadow-cyan-600/30">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Audit-Trail 2.0 Security Access
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cryptographic authentication & role-based authority
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Quick Demo Login (Hackathon Judges Showcase) */}
          <div className="p-4 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>1-Click Hackathon Demo Profiles</span>
              </div>
              <span className="text-[10px] uppercase font-mono text-cyan-600 dark:text-cyan-400 font-semibold tracking-wider">
                Instant Access
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
              Click any role to test its specific navigation permissions & telemetry access immediately:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((u) => {
                const meta = ROLE_METADATA[u.role];
                return (
                  <button
                    key={u.id}
                    onClick={() => handleQuickDemoLogin(u)}
                    className="p-2.5 rounded-lg text-left bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 shadow-sm transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {meta.label}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {u.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Tabs: Login vs Register */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Register New Profile
            </button>
          </div>

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="sarah.chen@globalaudit.org"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Security Passkey / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Authenticate & Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name & Title
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Marcus Vance"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enterprise Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="marcus.v@aerocold.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Organization / Entity
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="AeroCold Logistics LLC"
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Logistics Authority Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { role: ROLES.AUDITOR, label: 'Compliance Auditor' },
                    { role: ROLES.CARRIER, label: 'Logistics Carrier' },
                    { role: ROLES.CONSIGNEE, label: 'Cargo Consignee' },
                    { role: ROLES.ADMIN, label: 'Platform Admin' },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.role}
                      onClick={() => setRegRole(r.role)}
                      className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                        regRole === r.role
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-300'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{r.label}</span>
                        {regRole === r.role && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Master Security Key
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="Create secure password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Register & Generate Keys</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

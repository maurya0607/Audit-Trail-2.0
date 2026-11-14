import React, { useState } from 'react';
import { useAuth, ROLES, DEMO_USERS, ROLE_METADATA } from '../../context/AuthContext';
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
  const [tab, setTab] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regRole, setRegRole] = useState(ROLES.LOGISTICS_MANAGER);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-cyan-600 to-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-cyan-200" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Access Control & Identity</h2>
              <p className="text-xs text-cyan-100 font-medium">Audit Trail 2.0 Cryptographic Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 bg-slate-50 dark:bg-slate-900/50 shrink-0">
          <button
            onClick={() => setTab('login')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              tab === 'login'
                ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              tab === 'register'
                ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Register Entity
          </button>
          <button
            onClick={() => setTab('demo')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              tab === 'demo'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-amber-600/70 hover:text-amber-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hackathon Demo Roles</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="sarah.lin@apexlogistics.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Authenticate Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
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
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="elena@swissworldcargo.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Organization / Entity Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
                    placeholder="Swiss WorldCargo AG"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Assign Logistics Role (RBAC)
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                >
                  {Object.values(ROLES).map((roleKey) => {
                    const meta = ROLE_METADATA[roleKey];
                    return (
                      <option key={roleKey} value={roleKey}>
                        {meta.label} — {meta.description}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Register Identity</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {tab === 'demo' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                  1-Click Hackathon Evaluator Profiles: Switch instantly into any of the 6 roles defined in Section 2 Module 1.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_USERS.map((demo) => {
                  const meta = ROLE_METADATA[demo.role];
                  return (
                    <button
                      key={demo.role}
                      type="button"
                      onClick={() => handleQuickDemoLogin(demo)}
                      className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${meta.badgeBg}`}>
                          {meta.label}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{demo.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{demo.organization}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <span>Protected by SHA-256 RBAC Session Proof</span>
          <button onClick={onClose} className="font-semibold text-slate-700 dark:text-slate-300 hover:underline">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth, ROLE_METADATA, ROLES } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, User, Building2, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN);
  const [email, setEmail] = useState('admin@audittrail.io');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, selectedRole);
  };

  const roleMeta = ROLE_METADATA[selectedRole];

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-600/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Sign In to Audit Trail 2.0</h2>
        <p className="text-xs text-slate-500">Cryptographic Identity & Logistics Provenance</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Participant Role (RBAC)
          </label>
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
            >
              {Object.keys(ROLES).map((r) => (
                <option key={r} value={r}>
                  {ROLE_METADATA[r]?.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Official Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs shadow-md shadow-cyan-600/20 transition-all"
        >
          Authenticate Session
        </button>
      </form>
    </div>
  );
}

import React from 'react';
import { useAuth, ROLE_METADATA } from '../context/AuthContext';
import { User, ShieldCheck, Building2, Mail, Key, CheckCircle2 } from 'lucide-react';

export default function UserProfile() {
  const { user } = useAuth();
  const meta = user ? ROLE_METADATA[user.role] : null;

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-cyan-600/10 border-2 border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-extrabold text-2xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${meta?.badgeColor}`}>
                {meta?.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              User ID: <span className="font-mono text-cyan-600 dark:text-cyan-400">{user.id}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Enterprise Email
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{user.email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> Organization Entity
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{user.organization}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Role Scope & Permissions
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {meta?.description}
          </p>
          <div className="pt-2 flex flex-wrap gap-1.5">
            {meta?.allowedTabs.map((tab) => (
              <span
                key={tab}
                className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >
                /{tab}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

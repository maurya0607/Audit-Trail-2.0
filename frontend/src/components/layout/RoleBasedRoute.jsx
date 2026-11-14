import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function RoleBasedRoute({ tabId, children }) {
  const { canAccessTab, user } = useAuth();

  if (!canAccessTab(tabId)) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 max-w-md mx-auto">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Unauthorized Role Access
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your role (<strong>{user?.role}</strong>) does not have access permissions for this module.
        </p>
      </div>
    );
  }

  return children;
}

import React, { useState, useEffect } from 'react';
import { useAuth, ROLE_METADATA } from '../context/AuthContext';
import {
  User,
  Mail,
  Building2,
  Lock,
  CheckCircle2,
  XCircle,
  Save,
  ArrowLeft,
} from 'lucide-react';

export default function ProfileEdit({ setActiveTab }) {
  const { user, setUser } = useAuth();
  const meta = user ? ROLE_METADATA[user.role] : null;

  const [form, setForm] = useState({ name: '', email: '', organization: '', password: '' });
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  // Pre-fill with current user data
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        organization: user.organization || '',
        password: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      // Build updated user object
      const updated = {
        ...user,
        name: form.name,
        organization: form.organization,
      };

      // Try backend PATCH if token available
      const token = localStorage.getItem('audit_trail_token');
      if (token) {
        try {
          const payload = { name: form.name, organization: form.organization };
          if (form.password) payload.password = form.password;
          const res = await fetch('http://127.0.0.1:8000/api/profile', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              Object.assign(updated, {
                name: data.user.name,
                organization: data.user.organization,
              });
            }
          }
        } catch (_) {
          // Backend unavailable – proceed with local update
        }
      }

      // Always persist to localStorage
      setUser(updated);
      localStorage.setItem('audit_trail_user', JSON.stringify(updated));
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to save profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3">
        {setActiveTab && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Profile Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Update your account information below
          </p>
        </div>
      </div>

      {/* Alert */}
      {msg && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold ${
            msg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 shrink-0" />
          )}
          {msg.text}
        </div>
      )}

      {/* Avatar + Role Badge */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-cyan-600/10 border-2 border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-extrabold text-2xl shrink-0">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-black text-slate-900 dark:text-white">{user.name}</div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${meta?.badgeColor}`}>
            {meta?.label}
          </span>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
            {user.email}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
      >
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <User className="w-3.5 h-3.5" /> Full Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <Mail className="w-3.5 h-3.5" /> Email Address
            <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Read-only
            </span>
          </label>
          <input
            name="email"
            value={form.email}
            readOnly
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700/50 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
          />
        </div>

        {/* Organization */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <Building2 className="w-3.5 h-3.5" /> Organization / Company
          </label>
          <input
            name="organization"
            value={form.organization}
            onChange={handleChange}
            required
            placeholder="Your organization name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <Lock className="w-3.5 h-3.5" /> New Password
            <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Optional
            </span>
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-md shadow-cyan-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {setActiveTab && (
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

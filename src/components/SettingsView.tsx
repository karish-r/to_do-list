import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  Check,
  Copy,
  Database,
  KeyRound,
  Loader2,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { formatTimestampDate } from '../utils/dateUtils';
import { SUPABASE_SCHEMA_SQL } from '../utils/sqlTemplate';

interface SettingsViewProps {
  user: User;
  onUpdatePassword: (newPassword: string) => Promise<{ ok: boolean; error: string | null }>;
  onNotify: (toast: {
    type: 'success' | 'error' | 'info';
    title: string;
    message?: string;
  }) => void;
}

export function SettingsView({
  user,
  onUpdatePassword,
  onNotify,
}: SettingsViewProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const fullName =
    typeof user.user_metadata?.full_name === 'string' &&
    user.user_metadata.full_name.trim().length > 0
      ? user.user_metadata.full_name.trim()
      : 'Not specified';

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordError(null);
    setSavingPassword(true);
    const result = await onUpdatePassword(newPassword);
    setSavingPassword(false);

    if (result.ok) {
      setNewPassword('');
      setConfirmPassword('');
      onNotify({
        type: 'success',
        title: 'Password updated',
        message: 'Your account password has been changed successfully.',
      });
    } else if (result.error) {
      setPasswordError(result.error);
      onNotify({
        type: 'error',
        title: 'Password update failed',
        message: result.error,
      });
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopiedSql(true);
      onNotify({
        type: 'success',
        title: 'SQL script copied',
        message: 'Paste it into your Supabase SQL Editor to create or verify the schema.',
      });
      setTimeout(() => setCopiedSql(false), 2000);
    } catch {
      onNotify({
        type: 'error',
        title: 'Copy failed',
        message: 'Please select and copy the SQL script manually.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your profile, update your password, and inspect your Supabase schema reference.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <UserIcon className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-semibold text-slate-900">
            Profile Information
          </h2>
        </div>

        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs font-medium text-slate-500">Email Address</dt>
            <dd className="mt-1 font-medium text-slate-900 break-all">
              {user.email}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Display Name</dt>
            <dd className="mt-1 font-medium text-slate-900">{fullName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">User ID</dt>
            <dd className="mt-1 font-mono text-xs text-slate-700 break-all">
              {user.id}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Account Created</dt>
            <dd className="mt-1 font-mono text-xs tabular-nums text-slate-700">
              {formatTimestampDate(user.created_at)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <KeyRound className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-semibold text-slate-900">
            Change Password
          </h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 max-w-md">
          <div>
            <label
              htmlFor="settings-new-password"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              New Password
            </label>
            <input
              id="settings-new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="settings-confirm-password"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Confirm New Password
            </label>
            <input
              id="settings-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {passwordError && (
            <p className="text-xs font-medium text-red-600">{passwordError}</p>
          )}

          <button
            type="submit"
            disabled={savingPassword}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {savingPassword ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Database className="h-5 w-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Supabase PostgreSQL Schema & RLS
              </h2>
              <p className="text-xs text-slate-500">
                Row Level Security isolates every query with{' '}
                <code className="font-mono text-slate-700">auth.uid() = user_id</code>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopySql}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            {copiedSql ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied SQL</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy SQL Script</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 font-medium mb-3">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Client uses public anon key only; service_role key is never exposed.</span>
        </div>

        <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-4 text-xs font-mono text-slate-100 leading-relaxed max-h-72">
          <code>{SUPABASE_SCHEMA_SQL}</code>
        </pre>
      </section>
    </div>
  );
}

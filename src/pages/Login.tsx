import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react';
import { SupabaseSetupNotice } from '../components/SupabaseSetupNotice';

interface LoginProps {
  isConfigured: boolean;
  isPasswordRecovery: boolean;
  initialMode?: 'login' | 'forgot' | 'reset';
  onSignIn: (email: string, password: string) => Promise<{ ok: boolean; error: string | null }>;
  onRequestPasswordReset: (email: string) => Promise<{ ok: boolean; error: string | null }>;
  onUpdatePassword: (newPassword: string) => Promise<{ ok: boolean; error: string | null }>;
  onNavigateRegister: () => void;
  onNavigateLogin: () => void;
}

export function Login({
  isConfigured,
  isPasswordRecovery,
  initialMode = 'login',
  onSignIn,
  onRequestPasswordReset,
  onUpdatePassword,
  onNavigateRegister,
  onNavigateLogin,
}: LoginProps) {
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>(
    isPasswordRecovery ? 'reset' : initialMode
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const effectiveMode = isPasswordRecovery ? 'reset' : mode;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setSubmitting(true);
    const result = await onSignIn(email.trim(), password);
    setSubmitting(false);

    if (!result.ok && result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter the email address associated with your account.');
      return;
    }

    setSubmitting(true);
    const result = await onRequestPasswordReset(email.trim());
    setSubmitting(false);

    if (!result.ok && result.error) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage(
        'If an account exists for that email, a password reset link has been sent. Check your inbox.'
      );
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const result = await onUpdatePassword(newPassword);
    setSubmitting(false);

    if (!result.ok && result.error) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage('Your password has been updated. You can now access your workspace.');
      setMode('login');
      onNavigateLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-[46%] bg-slate-900 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm tracking-tight">
              TF
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              TaskFlow
            </span>
          </div>

          <div className="mt-16 max-w-md">
            <h1 className="text-3xl font-bold tracking-tight text-white leading-tight [text-wrap:balance]">
              Structured focus for your daily priorities.
            </h1>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Organize deliverables, monitor approaching deadlines, and keep every task synchronized securely in PostgreSQL with per-user Row Level Security.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-md border-t border-slate-800 pt-8">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Real-time database persistence</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Every task update, completion toggle, and deadline is saved directly to Supabase.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Isolated user workspaces</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Database policies ensure only your authenticated session can read or edit your tasks.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
              TF
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              TaskFlow
            </span>
          </div>

          {!isConfigured && <SupabaseSetupNotice />}

          <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xs">
            {effectiveMode === 'login' && (
              <>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Sign in to TaskFlow
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-600">
                    Enter your email and password to open your workspace.
                  </p>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div
                    role="status"
                    className="mt-5 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="login-password"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage(null);
                          setSuccessMessage(null);
                          setMode('forgot');
                        }}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !isConfigured}
                    className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign in</span>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={onNavigateRegister}
                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Create account
                  </button>
                </p>
              </>
            )}

            {effectiveMode === 'forgot' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setMode('login');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 mb-4"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to sign in</span>
                </button>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Reset your password
                </h2>
                <p className="mt-1.5 text-sm text-slate-600">
                  Enter your account email and we will send a secure password recovery link.
                </p>

                {errorMessage && (
                  <div
                    role="alert"
                    className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div
                    role="status"
                    className="mt-5 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="forgot-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !isConfigured}
                    className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending link...</span>
                      </>
                    ) : (
                      <span>Send reset link</span>
                    )}
                  </button>
                </form>
              </>
            )}

            {effectiveMode === 'reset' && (
              <>
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <KeyRound className="h-5 w-5" />
                  <span className="text-xs font-semibold">Password Recovery</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Set a new password
                </h2>
                <p className="mt-1.5 text-sm text-slate-600">
                  Choose a strong new password for your TaskFlow account.
                </p>

                {errorMessage && (
                  <div
                    role="alert"
                    className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleResetSubmit} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="reset-new-password"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      New password
                    </label>
                    <input
                      id="reset-new-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reset-confirm-password"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Confirm new password
                    </label>
                    <input
                      id="reset-confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !isConfigured}
                    className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Updating password...</span>
                      </>
                    ) : (
                      <span>Update password</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

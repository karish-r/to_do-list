import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { SupabaseSetupNotice } from '../components/SupabaseSetupNotice';

interface RegisterProps {
  isConfigured: boolean;
  onSignUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{
    ok: boolean;
    error: string | null;
    requiresEmailConfirmation: boolean;
  }>;
  onNavigateLogin: () => void;
}

export function Register({
  isConfigured,
  onSignUp,
  onNavigateLogin,
}: RegisterProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Email address is required.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const result = await onSignUp(email.trim(), password, fullName.trim());
    setSubmitting(false);

    if (!result.ok && result.error) {
      setErrorMessage(result.error);
      return;
    }

    if (result.requiresEmailConfirmation) {
      setConfirmationSent(true);
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
              Create your private task workspace.
            </h1>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Sign up in seconds to track priorities, deadlines, and progress metrics backed by Supabase Authentication and PostgreSQL.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 border-t border-slate-800 pt-6">
          Each account is isolated via PostgreSQL Row Level Security policies.
        </p>
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
            {confirmationSent ? (
              <div className="text-center space-y-4 py-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Verify your email
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We sent a confirmation link to{' '}
                  <span className="font-semibold text-slate-900">{email}</span>.
                  Open the link in your inbox to activate your account and sign in.
                </p>
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="w-full h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Return to sign in
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Create your account
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-600">
                    Get started with TaskFlow in under a minute.
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

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="register-name"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Full name <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="register-name"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-email"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="register-email"
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
                    <label
                      htmlFor="register-password"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
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

                  <div>
                    <label
                      htmlFor="register-confirm-password"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="register-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
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
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <span>Create account</span>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onNavigateLogin}
                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Sign in
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

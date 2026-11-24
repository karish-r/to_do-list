import { ArrowLeft, Compass } from 'lucide-react';

interface NotFoundProps {
  isAuthenticated: boolean;
  onNavigateHome: () => void;
}

export function NotFound({ isAuthenticated, onNavigateHome }: NotFoundProps) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Compass className="h-6 w-6" />
        </div>
        <p className="mt-4 text-xs font-mono font-semibold text-indigo-600">
          404
        </p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <button
          type="button"
          onClick={onNavigateHome}
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{isAuthenticated ? 'Back to Dashboard' : 'Go to Sign in'}</span>
        </button>
      </div>
    </main>
  );
}

import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { ToastMessage } from '../types/task';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 w-full max-w-sm px-4 sm:px-0 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        const borderClass = isSuccess
          ? 'border-emerald-200 bg-white'
          : isError
          ? 'border-red-200 bg-white'
          : 'border-slate-200 bg-white';

        const iconColor = isSuccess
          ? 'text-emerald-600'
          : isError
          ? 'text-red-600'
          : 'text-indigo-600';

        const Icon = isSuccess
          ? CheckCircle2
          : isError
          ? AlertCircle
          : Info;

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border ${borderClass} p-4 shadow-lg shadow-slate-900/5 transition-all duration-200`}
          >
            <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                {toast.title}
              </p>
              {toast.message && (
                <p className="mt-0.5 text-xs text-slate-600 break-words">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

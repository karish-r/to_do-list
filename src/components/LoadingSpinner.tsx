import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 'md',
  label,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClass =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';

  const content = (
    <div
      className="flex flex-col items-center justify-center gap-3 text-slate-600"
      role="status"
      aria-live="polite"
    >
      <Loader2 className={`${sizeClass} animate-spin text-indigo-600`} />
      {label && <p className="text-sm font-medium text-slate-600">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
        {content}
      </div>
    );
  }

  return content;
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading tasks">
      {[1, 2, 3, 4].map((row) => (
        <div
          key={row}
          className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1">
              <div className="h-5 w-5 rounded-md bg-slate-200 mt-0.5 shrink-0" />
              <div className="space-y-2.5 flex-1">
                <div className="h-4 w-2/5 rounded bg-slate-200" />
                <div className="h-3.5 w-4/5 rounded bg-slate-100" />
                <div className="h-3 w-1/2 rounded bg-slate-100 pt-1" />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-slate-100" />
              <div className="h-8 w-8 rounded-lg bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useEffect } from 'react';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';
import type { Task } from '../types/task';

interface ConfirmDeleteModalProps {
  task: Task | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: (task: Task) => Promise<void>;
}

export function ConfirmDeleteModal({
  task,
  deleting,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    if (!task) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !deleting) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [task, deleting, onCancel]);

  if (!task) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-task-title"
      onClick={() => !deleting && onCancel()}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="delete-task-title"
                className="text-base font-semibold text-slate-900"
              >
                Delete task?
              </h2>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-slate-900">
                  "{task.title}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={deleting}
            onClick={onCancel}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={deleting}
            onClick={onCancel}
            className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={() => onConfirm(task)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Delete Task</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

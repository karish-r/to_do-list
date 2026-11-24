import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Flag,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { Task } from '../types/task';
import {
  formatDueDate,
  formatTimestampDate,
  isTaskOverdue,
} from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  isMutating?: boolean;
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({
  task,
  isMutating = false,
  onToggleStatus,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const isCompleted = task.status === 'Completed';
  const overdue = isTaskOverdue(task);

  const priorityConfig = {
    High: {
      label: 'High priority',
      textClass: 'text-red-700',
    },
    Medium: {
      label: 'Medium priority',
      textClass: 'text-amber-700',
    },
    Low: {
      label: 'Low priority',
      textClass: 'text-slate-600',
    },
  }[task.priority];

  const cardSurfaceClass = overdue
    ? 'border-red-200 bg-red-50/30 hover:border-red-300'
    : isCompleted
    ? 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
    : 'border-slate-200 bg-white hover:border-slate-300';

  return (
    <article
      className={`group rounded-xl border ${cardSurfaceClass} p-4 sm:p-5 transition-colors duration-150`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <button
            type="button"
            disabled={isMutating}
            onClick={() => onToggleStatus(task)}
            aria-label={
              isCompleted
                ? `Mark "${task.title}" as pending`
                : `Mark "${task.title}" as completed`
            }
            aria-pressed={isCompleted}
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:opacity-50 ${
              isCompleted
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-300 bg-white hover:border-indigo-500'
            }`}
          >
            {isMutating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : isCompleted ? (
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            ) : null}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h3
                className={`text-base font-semibold tracking-tight break-words ${
                  isCompleted
                    ? 'line-through text-slate-400'
                    : 'text-slate-900'
                }`}
              >
                {task.title}
              </h3>

              {overdue && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Overdue</span>
                </span>
              )}
            </div>

            {task.description && (
              <p
                className={`mt-1.5 text-sm leading-relaxed break-words ${
                  isCompleted ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {task.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
              <span
                className={`inline-flex items-center gap-1 font-medium ${priorityConfig.textClass}`}
              >
                <Flag className="h-3 w-3 shrink-0" />
                <span>{priorityConfig.label}</span>
              </span>

              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>

              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  isCompleted ? 'text-emerald-700' : 'text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3 w-3 shrink-0" />
                ) : (
                  <Clock className="h-3 w-3 shrink-0" />
                )}
                <span>{task.status}</span>
              </span>

              {task.due_date && (
                <>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-mono tabular-nums ${
                      overdue ? 'text-red-700 font-medium' : 'text-slate-500'
                    }`}
                  >
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>Due {formatDueDate(task.due_date)}</span>
                  </span>
                </>
              )}

              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>

              <span className="font-mono tabular-nums text-slate-400">
                Created {formatTimestampDate(task.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            disabled={isMutating}
            onClick={() => onEdit(task)}
            aria-label={`Edit "${task.title}"`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            type="button"
            disabled={isMutating}
            onClick={() => onDelete(task)}
            aria-label={`Delete "${task.title}"`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}

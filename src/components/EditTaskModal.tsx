import { useEffect, useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskUpdateInput,
} from '../types/task';

interface EditTaskModalProps {
  task: Task | null;
  saving: boolean;
  onClose: () => void;
  onSave: (taskId: string, input: TaskUpdateInput) => Promise<boolean>;
}

const PRIORITIES: TaskPriority[] = ['High', 'Medium', 'Low'];
const STATUSES: TaskStatus[] = ['Pending', 'Completed'];

export function EditTaskModal({
  task,
  saving,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setDueDate(task.due_date ?? '');
      setPriority(task.priority);
      setStatus(task.status);
      setValidationError(null);
    }
  }, [task]);

  useEffect(() => {
    if (!task) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [task, saving, onClose]);

  if (!task) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setValidationError('Task title is required.');
      return;
    }
    if (trimmed.length > 200) {
      setValidationError('Task title cannot exceed 200 characters.');
      return;
    }

    setValidationError(null);
    const ok = await onSave(task.id, {
      title: trimmed,
      description,
      due_date: dueDate,
      priority,
      status,
    });
    if (ok) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
      onClick={() => !saving && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2
            id="edit-task-title"
            className="text-lg font-semibold text-slate-900"
          >
            Edit Task
          </h2>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            aria-label="Close edit modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="edit-task-title-input"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Task Title <span className="text-red-600">*</span>
            </label>
            <input
              id="edit-task-title-input"
              type="text"
              autoFocus
              maxLength={200}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError(null);
              }}
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {validationError && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {validationError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-task-description-input"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="edit-task-description-input"
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add helpful context or notes..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-task-due-date"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Due Date
              </label>
              <input
                id="edit-task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-mono text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-slate-700 mb-1.5">
                Priority
              </span>
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200/80 h-10">
                {PRIORITIES.map((item) => {
                  const selected = priority === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPriority(item)}
                      className={`rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                        selected
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1.5">
              Status
            </span>
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200/80 h-10 max-w-xs">
              {STATUSES.map((item) => {
                const selected = status === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStatus(item)}
                    className={`rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                      selected
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import type { Task } from '../types/task';

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isTaskOverdue(task: Pick<Task, 'status' | 'due_date'>): boolean {
  if (task.status === 'Completed' || !task.due_date) {
    return false;
  }
  return task.due_date < getTodayIsoDate();
}

export function formatDueDate(dateString: string | null): string {
  if (!dateString) {
    return 'No due date';
  }
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);
    const localDate = new Date(year, month, day);
    if (!Number.isNaN(localDate.getTime())) {
      return localDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }
  return dateString;
}

export function formatTimestampDate(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatHeaderDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

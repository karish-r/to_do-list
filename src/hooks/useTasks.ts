import { useCallback, useEffect, useMemo, useState } from 'react';
import { taskService } from '../services/taskService';
import type { Task, TaskInput, TaskStats, TaskStatus, TaskUpdateInput } from '../types/task';
import { isTaskOverdue } from '../utils/dateUtils';

interface NotifyFn {
  (toast: { type: 'success' | 'error' | 'info'; title: string; message?: string }): void;
}

export function useTasks(userId: string | undefined, onNotify?: NotifyFn) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [mutatingIds, setMutatingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await taskService.fetchTasks(userId);
    if (result.error) {
      setError(result.error);
      onNotify?.({
        type: 'error',
        title: 'Failed to load tasks',
        message: result.error,
      });
    } else {
      setTasks(result.data ?? []);
    }

    setLoading(false);
  }, [userId, onNotify]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(
    async (input: TaskInput): Promise<boolean> => {
      if (!userId) {
        return false;
      }

      setSubmitting(true);
      const result = await taskService.createTask(userId, input);
      setSubmitting(false);

      if (result.error || !result.data) {
        onNotify?.({
          type: 'error',
          title: 'Could not create task',
          message: result.error ?? 'Unknown error',
        });
        return false;
      }

      setTasks((prev) => [result.data!, ...prev]);
      onNotify?.({
        type: 'success',
        title: 'Task created',
        message: `"${result.data.title}" added to your workspace.`,
      });
      return true;
    },
    [userId, onNotify]
  );

  const editTask = useCallback(
    async (taskId: string, input: TaskUpdateInput): Promise<boolean> => {
      if (!userId) {
        return false;
      }

      setMutatingIds((prev) => new Set(prev).add(taskId));
      const result = await taskService.updateTask(taskId, userId, input);
      setMutatingIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });

      if (result.error || !result.data) {
        onNotify?.({
          type: 'error',
          title: 'Could not update task',
          message: result.error ?? 'Unknown error',
        });
        return false;
      }

      setTasks((prev) =>
        prev.map((item) => (item.id === taskId ? result.data! : item))
      );
      onNotify?.({
        type: 'success',
        title: 'Task updated',
        message: `"${result.data.title}" has been saved.`,
      });
      return true;
    },
    [userId, onNotify]
  );

  const toggleStatus = useCallback(
    async (task: Task): Promise<boolean> => {
      if (!userId) {
        return false;
      }

      const nextStatus: TaskStatus =
        task.status === 'Completed' ? 'Pending' : 'Completed';

      setMutatingIds((prev) => new Set(prev).add(task.id));
      const result = await taskService.toggleTaskStatus(
        task.id,
        userId,
        nextStatus
      );
      setMutatingIds((prev) => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });

      if (result.error || !result.data) {
        onNotify?.({
          type: 'error',
          title: 'Status update failed',
          message: result.error ?? 'Unknown error',
        });
        return false;
      }

      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? result.data! : item))
      );
      onNotify?.({
        type: 'success',
        title:
          nextStatus === 'Completed' ? 'Task completed' : 'Task reopened',
        message: `"${result.data.title}" marked as ${nextStatus.toLowerCase()}.`,
      });
      return true;
    },
    [userId, onNotify]
  );

  const removeTask = useCallback(
    async (task: Task): Promise<boolean> => {
      if (!userId) {
        return false;
      }

      setMutatingIds((prev) => new Set(prev).add(task.id));
      const result = await taskService.deleteTask(task.id, userId);
      setMutatingIds((prev) => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });

      if (result.error) {
        onNotify?.({
          type: 'error',
          title: 'Could not delete task',
          message: result.error,
        });
        return false;
      }

      setTasks((prev) => prev.filter((item) => item.id !== task.id));
      onNotify?.({
        type: 'success',
        title: 'Task deleted',
        message: `"${task.title}" was removed.`,
      });
      return true;
    },
    [userId, onNotify]
  );

  const stats: TaskStats = useMemo(() => {
    let completed = 0;
    let pending = 0;
    let overdue = 0;

    for (const task of tasks) {
      if (task.status === 'Completed') {
        completed += 1;
      } else {
        pending += 1;
        if (isTaskOverdue(task)) {
          overdue += 1;
        }
      }
    }

    return {
      total: tasks.length,
      completed,
      pending,
      overdue,
    };
  }, [tasks]);

  return {
    tasks,
    stats,
    loading,
    submitting,
    mutatingIds,
    error,
    refreshTasks: loadTasks,
    addTask,
    editTask,
    toggleStatus,
    removeTask,
  };
}

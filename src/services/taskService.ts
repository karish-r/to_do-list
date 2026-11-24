import { getSupabaseClient } from './supabaseClient';
import type { Task, TaskInput, TaskStatus, TaskUpdateInput } from '../types/task';

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

function mapTaskError(err: unknown): string {
  const message =
    err && typeof err === 'object' && 'message' in err
      ? String((err as { message: unknown }).message)
      : String(err);

  const code =
    err && typeof err === 'object' && 'code' in err
      ? String((err as { code: unknown }).code)
      : '';

  if (
    code === '42P01' ||
    message.toLowerCase().includes('relation "public.tasks" does not exist') ||
    message.toLowerCase().includes("could not find the table 'public.tasks'")
  ) {
    return 'The "tasks" table does not exist in your Supabase database yet. Run supabase/schema.sql in your Supabase SQL Editor first.';
  }

  if (code === '42501' || message.toLowerCase().includes('row-level security')) {
    return 'Permission denied by database security policy. Ensure you are signed in and RLS policies are configured.';
  }

  if (message.toLowerCase().includes('failed to fetch')) {
    return 'Could not connect to Supabase. Verify your network connection and project URL.';
  }

  return message || 'Failed to complete task operation.';
}

function validateTaskInput(input: TaskInput): string | null {
  const trimmedTitle = input.title.trim();
  if (!trimmedTitle) {
    return 'Task title is required.';
  }
  if (trimmedTitle.length > 200) {
    return 'Task title must be 200 characters or fewer.';
  }
  if (input.description && input.description.length > 2000) {
    return 'Description must be 2,000 characters or fewer.';
  }
  if (!['High', 'Medium', 'Low'].includes(input.priority)) {
    return 'Invalid task priority selected.';
  }
  return null;
}

export const taskService = {
  async fetchTasks(userId: string): Promise<ServiceResult<Task[]>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: mapTaskError(error) };
      }

      return { data: (data as Task[]) ?? [], error: null };
    } catch (err) {
      return { data: null, error: mapTaskError(err) };
    }
  },

  async createTask(userId: string, input: TaskInput): Promise<ServiceResult<Task>> {
    const validationError = validateTaskInput(input);
    if (validationError) {
      return { data: null, error: validationError };
    }

    try {
      const client = getSupabaseClient();
      const payload = {
        user_id: userId,
        title: input.title.trim(),
        description: input.description.trim() ? input.description.trim() : null,
        due_date: input.due_date.trim() ? input.due_date.trim() : null,
        priority: input.priority,
        status: 'Pending' as TaskStatus,
      };

      const { data, error } = await client
        .from('tasks')
        .insert(payload)
        .select('*')
        .single();

      if (error) {
        return { data: null, error: mapTaskError(error) };
      }

      return { data: data as Task, error: null };
    } catch (err) {
      return { data: null, error: mapTaskError(err) };
    }
  },

  async updateTask(
    taskId: string,
    userId: string,
    input: TaskUpdateInput
  ): Promise<ServiceResult<Task>> {
    const validationError = validateTaskInput(input);
    if (validationError) {
      return { data: null, error: validationError };
    }

    try {
      const client = getSupabaseClient();
      const updates: Record<string, unknown> = {
        title: input.title.trim(),
        description: input.description.trim() ? input.description.trim() : null,
        due_date: input.due_date.trim() ? input.due_date.trim() : null,
        priority: input.priority,
      };

      if (input.status) {
        updates.status = input.status;
      }

      const { data, error } = await client
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        return { data: null, error: mapTaskError(error) };
      }

      return { data: data as Task, error: null };
    } catch (err) {
      return { data: null, error: mapTaskError(err) };
    }
  },

  async toggleTaskStatus(
    taskId: string,
    userId: string,
    nextStatus: TaskStatus
  ): Promise<ServiceResult<Task>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('tasks')
        .update({ status: nextStatus })
        .eq('id', taskId)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        return { data: null, error: mapTaskError(error) };
      }

      return { data: data as Task, error: null };
    } catch (err) {
      return { data: null, error: mapTaskError(err) };
    }
  },

  async deleteTask(taskId: string, userId: string): Promise<ServiceResult<boolean>> {
    try {
      const client = getSupabaseClient();
      const { error } = await client
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) {
        return { data: null, error: mapTaskError(error) };
      }

      return { data: true, error: null };
    } catch (err) {
      return { data: null, error: mapTaskError(err) };
    }
  },
};

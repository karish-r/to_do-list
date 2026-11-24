export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'Completed';
export type StatusFilter = 'All' | 'Pending' | 'Completed';
export type PriorityFilter = 'All' | TaskPriority;
export type SortOption = 'created_desc' | 'created_asc' | 'due_asc' | 'due_desc';
export type SidebarTab = 'dashboard' | 'all' | 'pending' | 'completed' | 'settings';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  title: string;
  description: string;
  due_date: string;
  priority: TaskPriority;
}

export interface TaskUpdateInput extends TaskInput {
  status?: TaskStatus;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

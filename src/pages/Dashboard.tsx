import { useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  AlertCircle,
  CheckSquare,
  Plus,
  RefreshCw,
  SearchX,
} from 'lucide-react';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { DashboardStats } from '../components/DashboardStats';
import { EditTaskModal } from '../components/EditTaskModal';
import { FilterTasks } from '../components/FilterTasks';
import { Header } from '../components/Header';
import { TaskListSkeleton } from '../components/LoadingSpinner';
import { Pagination } from '../components/Pagination';
import { SearchBar } from '../components/SearchBar';
import { SettingsView } from '../components/SettingsView';
import { Sidebar } from '../components/Sidebar';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { useTasks } from '../hooks/useTasks';
import type {
  PriorityFilter,
  SidebarTab,
  SortOption,
  StatusFilter,
  Task,
  ToastMessage,
} from '../types/task';

interface DashboardProps {
  user: User;
  onSignOut: () => Promise<void>;
  onUpdatePassword: (newPassword: string) => Promise<{ ok: boolean; error: string | null }>;
  onNotify: (toast: Omit<ToastMessage, 'id'>) => void;
}

const PAGE_SIZE = 8;

export function Dashboard({
  user,
  onSignOut,
  onUpdatePassword,
  onNotify,
}: DashboardProps) {
  const {
    tasks,
    stats,
    loading,
    submitting,
    mutatingIds,
    error,
    refreshTasks,
    addTask,
    editTask,
    toggleStatus,
    removeTask,
  } = useTasks(user.id, onNotify);

  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('created_desc');
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const handleSelectSidebarTab = (tab: SidebarTab) => {
    setActiveTab(tab);
    if (tab === 'all' || tab === 'dashboard') {
      setStatusFilter('All');
    } else if (tab === 'pending') {
      setStatusFilter('Pending');
    } else if (tab === 'completed') {
      setStatusFilter('Completed');
    }
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (nextStatus: StatusFilter) => {
    setStatusFilter(nextStatus);
    if (activeTab !== 'dashboard' && activeTab !== 'settings') {
      if (nextStatus === 'All') setActiveTab('all');
      if (nextStatus === 'Pending') setActiveTab('pending');
      if (nextStatus === 'Completed') setActiveTab('completed');
    }
    setCurrentPage(1);
  };

  const filteredAndSortedTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      if (query && !task.title.toLowerCase().includes(query)) {
        return false;
      }
      if (statusFilter !== 'All' && task.status !== statusFilter) {
        return false;
      }
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) {
        return false;
      }
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'created_desc') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'created_asc') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'due_asc') {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return a.due_date.localeCompare(b.due_date);
      }
      // due_desc
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return b.due_date.localeCompare(a.due_date);
    });

    return sorted;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTasks.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedTasks.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedTasks, currentPage]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== 'All' ||
    priorityFilter !== 'All';

  const clearAllFilters = () => {
    setSearchQuery('');
    setPriorityFilter('All');
    handleStatusFilterChange('All');
    setCurrentPage(1);
  };

  const viewTitle = {
    dashboard: 'Dashboard Overview',
    all: 'All Tasks',
    pending: 'Pending Tasks',
    completed: 'Completed Tasks',
    settings: 'Settings',
  }[activeTab];

  const viewSubtitle = {
    dashboard: 'Track progress, manage priorities, and keep deadlines on schedule.',
    all: 'Browse and organize every task in your personal workspace.',
    pending: 'Focus on active items waiting to be completed.',
    completed: 'Review your finished deliverables and milestones.',
    settings: '',
  }[activeTab];

  const handleConfirmDelete = async (task: Task) => {
    const ok = await removeTask(task);
    if (ok) {
      setDeletingTask(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectSidebarTab}
        stats={stats}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigateSettings={() => handleSelectSidebarTab('settings')}
          onSignOut={onSignOut}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl w-full mx-auto">
          {activeTab === 'settings' ? (
            <SettingsView
              user={user}
              onUpdatePassword={onUpdatePassword}
              onNotify={onNotify}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {viewTitle}
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">{viewSubtitle}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xs whitespace-nowrap shrink-0 self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </button>
              </div>

              {activeTab === 'dashboard' && (
                <DashboardStats stats={stats} loading={loading} />
              )}

              <section
                aria-label="Task controls"
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1"
              >
                <SearchBar
                  value={searchQuery}
                  onChange={(value) => {
                    setSearchQuery(value);
                    setCurrentPage(1);
                  }}
                />

                <FilterTasks
                  statusFilter={statusFilter}
                  onStatusChange={handleStatusFilterChange}
                  priorityFilter={priorityFilter}
                  onPriorityChange={(priority) => {
                    setPriorityFilter(priority);
                    setCurrentPage(1);
                  }}
                  sortBy={sortBy}
                  onSortChange={(sort) => {
                    setSortBy(sort);
                    setCurrentPage(1);
                  }}
                />
              </section>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-900">
                        Unable to sync tasks
                      </p>
                      <p className="mt-0.5 text-xs text-red-700">{error}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={refreshTasks}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors shrink-0 self-start sm:self-auto"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              <section aria-label="Task list" className="space-y-3">
                {loading ? (
                  <TaskListSkeleton />
                ) : tasks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <CheckSquare className="h-6 w-6" />
                    </div>
                    <h2 className="mt-4 text-base font-semibold text-slate-900">
                      Your task list is empty
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-600 max-w-sm mx-auto">
                      Create your first task with a priority and due date to start tracking your progress.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create First Task</span>
                    </button>
                  </div>
                ) : filteredAndSortedTasks.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <SearchX className="h-5 w-5" />
                    </div>
                    <h2 className="mt-3.5 text-base font-semibold text-slate-900">
                      No matching tasks found
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Try adjusting your search term or active status and priority filters.
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="mt-5 inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Reset all filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {paginatedTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          isMutating={mutatingIds.has(task.id)}
                          onToggleStatus={toggleStatus}
                          onEdit={(item) => setEditingTask(item)}
                          onDelete={(item) => setDeletingTask(item)}
                        />
                      ))}
                    </div>

                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredAndSortedTasks.length}
                      pageSize={PAGE_SIZE}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </section>
            </div>
          )}
        </main>
      </div>

      <TaskForm
        isOpen={isAddModalOpen}
        submitting={submitting}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addTask}
      />

      <EditTaskModal
        task={editingTask}
        saving={editingTask ? mutatingIds.has(editingTask.id) : false}
        onClose={() => setEditingTask(null)}
        onSave={editTask}
      />

      <ConfirmDeleteModal
        task={deletingTask}
        deleting={deletingTask ? mutatingIds.has(deletingTask.id) : false}
        onCancel={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

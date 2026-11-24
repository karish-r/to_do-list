import {
  CheckCircle2,
  Clock,
  LayoutDashboard,
  ListTodo,
  Settings,
  X,
} from 'lucide-react';
import type { SidebarTab, TaskStats } from '../types/task';

interface SidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  stats: TaskStats;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  stats,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const navItems: Array<{
    id: SidebarTab;
    label: string;
    icon: typeof LayoutDashboard;
    count?: number;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'all', label: 'All Tasks', icon: ListTodo, count: stats.total },
    { id: 'pending', label: 'Pending Tasks', icon: Clock, count: stats.pending },
    {
      id: 'completed',
      label: 'Completed Tasks',
      icon: CheckCircle2,
      count: stats.completed,
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (tab: SidebarTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const sidebarBody = (
    <div className="flex h-full flex-col bg-white border-r border-slate-200 w-64">
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm tracking-tight">
            TF
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            TaskFlow
          </span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          aria-label="Close navigation menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </span>
              {typeof item.count === 'number' && (
                <span
                  className={`font-mono text-xs tabular-nums ${
                    isActive ? 'text-indigo-700 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="rounded-lg bg-slate-50 border border-slate-200/80 px-3.5 py-3">
          <p className="text-xs font-medium text-slate-700">Workspace Sync</p>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Tasks are encrypted in transit and protected per account via PostgreSQL RLS.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0">{sidebarBody}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-50 flex h-full">{sidebarBody}</div>
        </div>
      )}
    </>
  );
}

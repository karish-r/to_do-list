import { AlertTriangle, CheckCircle2, Clock, Layers } from 'lucide-react';
import type { TaskStats } from '../types/task';

interface DashboardStatsProps {
  stats: TaskStats;
  loading?: boolean;
}

export function DashboardStats({ stats, loading = false }: DashboardStatsProps) {
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      detail: `${completionRate}% completion rate`,
      icon: Layers,
      iconClass: 'text-indigo-600 bg-indigo-50',
      valueClass: 'text-slate-900',
      detailClass: 'text-slate-500',
    },
    {
      label: 'Completed Tasks',
      value: stats.completed,
      detail: stats.completed === 1 ? '1 task finished' : `${stats.completed} tasks finished`,
      icon: CheckCircle2,
      iconClass: 'text-emerald-600 bg-emerald-50',
      valueClass: 'text-slate-900',
      detailClass: 'text-emerald-700',
    },
    {
      label: 'Pending Tasks',
      value: stats.pending,
      detail: stats.pending === 0 ? 'All caught up' : 'In active queue',
      icon: Clock,
      iconClass: 'text-amber-600 bg-amber-50',
      valueClass: 'text-slate-900',
      detailClass: 'text-slate-500',
    },
    {
      label: 'Overdue Tasks',
      value: stats.overdue,
      detail: stats.overdue > 0 ? 'Past due date' : 'On schedule',
      icon: AlertTriangle,
      iconClass:
        stats.overdue > 0
          ? 'text-red-600 bg-red-50'
          : 'text-slate-500 bg-slate-100',
      valueClass: stats.overdue > 0 ? 'text-red-600' : 'text-slate-900',
      detailClass: stats.overdue > 0 ? 'text-red-600 font-medium' : 'text-slate-500',
    },
  ];

  return (
    <section
      aria-label="Task statistics"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">{card.label}</p>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${card.iconClass}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              {loading ? (
                <div className="h-8 w-14 rounded bg-slate-200 animate-pulse" />
              ) : (
                <p
                  className={`text-3xl font-bold font-mono tabular-nums tracking-tight ${card.valueClass}`}
                >
                  {card.value}
                </p>
              )}
              <span className={`text-xs tabular-nums ${card.detailClass}`}>
                {card.detail}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

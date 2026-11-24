import { ArrowUpDown } from 'lucide-react';
import type {
  PriorityFilter,
  SortOption,
  StatusFilter,
} from '../types/task';

interface FilterTasksProps {
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  priorityFilter: PriorityFilter;
  onPriorityChange: (priority: PriorityFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const STATUS_OPTIONS: StatusFilter[] = ['All', 'Pending', 'Completed'];
const PRIORITY_OPTIONS: PriorityFilter[] = ['All', 'High', 'Medium', 'Low'];

export function FilterTasks({
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
}: FilterTasksProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200/70"
        role="group"
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map((option) => {
          const active = statusFilter === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onStatusChange(option)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                active
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={active}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div
        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200/70"
        role="group"
        aria-label="Filter by priority"
      >
        {PRIORITY_OPTIONS.map((option) => {
          const active = priorityFilter === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onPriorityChange(option)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                active
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={active}
            >
              {option === 'All' ? 'All Priorities' : option}
            </button>
          );
        })}
      </div>

      <div className="relative flex items-center">
        <ArrowUpDown
          className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400"
          aria-hidden="true"
        />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Sort tasks"
          className="h-9 rounded-lg border border-slate-200 bg-white pl-8 pr-8 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors cursor-pointer"
        >
          <option value="created_desc">Newest created</option>
          <option value="created_asc">Oldest created</option>
          <option value="due_asc">Due date (earliest)</option>
          <option value="due_desc">Due date (latest)</option>
        </select>
      </div>
    </div>
  );
}

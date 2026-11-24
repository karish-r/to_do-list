import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i += 1) {
    pages.push(i);
  }

  return (
    <nav
      aria-label="Task list pagination"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200"
    >
      <p className="text-xs font-mono tabular-nums text-slate-500">
        Showing {startItem}–{endItem} of {totalItems} tasks
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page) => {
            const active = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={active ? 'page' : undefined}
                className={`h-9 min-w-[36px] px-2.5 rounded-lg text-xs font-mono tabular-nums font-medium transition-colors ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </nav>
  );
}

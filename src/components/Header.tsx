import { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  Calendar,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { formatHeaderDate } from '../utils/dateUtils';

interface HeaderProps {
  user: User;
  onOpenMobileMenu: () => void;
  onNavigateSettings: () => void;
  onSignOut: () => Promise<void>;
}

export function Header({
  user,
  onOpenMobileMenu,
  onNavigateSettings,
  onSignOut,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const fullName =
    typeof user.user_metadata?.full_name === 'string' &&
    user.user_metadata.full_name.trim().length > 0
      ? user.user_metadata.full_name.trim()
      : null;

  const displayName = fullName ?? user.email?.split('@')[0] ?? 'Workspace User';
  const userEmail = user.email ?? 'Authenticated User';
  const initials = displayName.slice(0, 2).toUpperCase();
  const currentDate = formatHeaderDate(new Date());

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    setSigningOut(true);
    setMenuOpen(false);
    await onSignOut();
    setSigningOut(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white font-bold text-xs">
            TF
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            TaskFlow
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-slate-900 truncate">
            Welcome back, {displayName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden md:flex items-center gap-2 text-xs font-mono tabular-nums text-slate-500 whitespace-nowrap">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{currentDate}</span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold shrink-0">
              {initials}
            </span>
            <span className="hidden sm:inline max-w-[160px] truncate text-xs font-medium text-slate-700">
              {userEmail}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg shadow-slate-900/5 z-40"
            >
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {userEmail}
                </p>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onNavigateSettings();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                <span>Account Settings</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onNavigateSettings();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors sm:hidden"
              >
                <UserIcon className="h-4 w-4 text-slate-400" />
                <span>{currentDate}</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                role="menuitem"
                disabled={signingOut}
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                <span>{signingOut ? 'Signing out...' : 'Log out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

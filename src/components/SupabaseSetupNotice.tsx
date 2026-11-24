import { useState } from 'react';
import { AlertTriangle, Check, Copy, Database } from 'lucide-react';
import { SUPABASE_SCHEMA_SQL } from '../utils/sqlTemplate';

export function SupabaseSetupNotice() {
  const [showSql, setShowSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const envTemplate = `VITE_SUPABASE_URL=your_supabase_project_url\nVITE_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key`;

  const copyText = async (text: string, which: 'env' | 'sql') => {
    try {
      await navigator.clipboard.writeText(text);
      if (which === 'env') {
        setCopiedEnv(true);
        setTimeout(() => setCopiedEnv(false), 2000);
      } else {
        setCopiedSql(true);
        setTimeout(() => setCopiedSql(false), 2000);
      }
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-left">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-sm font-semibold text-slate-900">
            Supabase Connection Not Configured
          </p>
          <p className="text-xs text-slate-700 leading-relaxed">
            Add your Supabase Project URL and public Anon Key to a{' '}
            <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">
              .env
            </code>{' '}
            file in the project root, then restart the dev server to enable live authentication and PostgreSQL persistence.
          </p>

          <div className="rounded-lg border border-amber-200 bg-white p-2.5 flex items-center justify-between gap-2">
            <pre className="text-[11px] font-mono text-slate-800 overflow-x-auto">
              {envTemplate}
            </pre>
            <button
              type="button"
              onClick={() => copyText(envTemplate, 'env')}
              className="shrink-0 inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              {copiedEnv ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy .env</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowSql((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-800"
            >
              <Database className="h-3.5 w-3.5" />
              <span>{showSql ? 'Hide SQL setup script' : 'View SQL setup script (supabase/schema.sql)'}</span>
            </button>
          </div>

          {showSql && (
            <div className="mt-2 space-y-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => copyText(SUPABASE_SCHEMA_SQL, 'sql')}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                >
                  {copiedSql ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span>Copied SQL</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="max-h-48 overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] font-mono text-slate-100 leading-relaxed">
                <code>{SUPABASE_SCHEMA_SQL}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

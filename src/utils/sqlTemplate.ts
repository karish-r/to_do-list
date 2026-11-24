export const SUPABASE_SCHEMA_SQL = `-- TaskFlow Database Schema & Row Level Security (RLS)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 200),
  description TEXT CHECK (description IS NULL OR char_length(description) <= 2000),
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks (user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_due_date ON public.tasks (user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_user_created_at ON public.tasks (user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.handle_tasks_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_tasks_updated_at ON public.tasks;
CREATE TRIGGER set_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_tasks_updated_at();

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
CREATE POLICY "Users can view their own tasks"
  ON public.tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
CREATE POLICY "Users can create their own tasks"
  ON public.tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
CREATE POLICY "Users can update their own tasks"
  ON public.tasks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
CREATE POLICY "Users can delete their own tasks"
  ON public.tasks FOR DELETE TO authenticated USING (auth.uid() = user_id);`;

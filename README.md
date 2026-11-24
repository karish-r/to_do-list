# TaskFlow

A full-stack, responsive To-Do List & Task Management web application built with **React**, **TypeScript**, **Tailwind CSS**, **Lucide React**, and **Supabase** (PostgreSQL + Authentication + Row Level Security).

## Features

- **Supabase Authentication**: Email/password registration, login, logout, persistent sessions, forgot password email flow, and password reset recovery.
- **PostgreSQL Task CRUD**: Create, read, update, delete, and toggle completion status (`Pending` / `Completed`) directly against your Supabase `tasks` table.
- **Row Level Security (RLS)**: Every database query is strictly scoped to the authenticated user via `auth.uid() = user_id`.
- **Dashboard & Live Statistics**: Real-time counts for Total Tasks, Completed Tasks, Pending Tasks, and Overdue Tasks.
- **Search, Filter, Sort & Pagination**: Search by title, filter by status (`All`, `Pending`, `Completed`) and priority (`High`, `Medium`, `Low`), sort by creation date or due date, highlight overdue tasks, and paginate large task lists.

---

## 1. Prerequisites

- Node.js 18+ (or 20+)
- A [Supabase](https://supabase.com) account and project

---

## 2. Database Setup (Supabase SQL Editor)

1. Open your project in the **Supabase Dashboard**.
2. Go to **SQL Editor** -> **New Query**.
3. Copy the entire contents of `supabase/schema.sql` and run it.

This script creates:
- The `public.tasks` table with UUID primary key, foreign key to `auth.users(id)`, `CHECK` constraints for `priority` (`High`, `Medium`, `Low`) and `status` (`Pending`, `Completed`), and automatic `created_at` / `updated_at` timestamps.
- Indexes on `user_id`, `(user_id, status)`, `(user_id, due_date)`, and `(user_id, created_at DESC)`.
- A `BEFORE UPDATE` trigger to update `updated_at` automatically.
- Row Level Security (`ENABLE ROW LEVEL SECURITY`) with `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies enforcing `auth.uid() = user_id`.

---

## 3. Authentication URL Configuration (Optional for Password Reset)

In your **Supabase Dashboard -> Authentication -> URL Configuration**:
- Set **Site URL** to your local or production app URL (e.g. `http://localhost:3000`).
- Add `http://localhost:3000/reset-password` (and your deployed URL `/reset-password`) to **Redirect URLs** so password recovery links route directly back into TaskFlow.

---

## 4. Environment Variables

Create a `.env` file in the project root (copying from `.env.example`):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
```

Where to find these values:
- **Supabase Dashboard -> Project Settings -> API**:
  - Copy **Project URL** into `VITE_SUPABASE_URL`.
  - Copy the **anon / public** (or publishable) key into `VITE_SUPABASE_ANON_KEY`.
- Never place your `service_role` secret key in `.env` or any frontend file.

---

## 5. Install & Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

To run type-checking and build for production:

```bash
npm run lint
npm run build
```

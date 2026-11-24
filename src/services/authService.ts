import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured, supabase } from './supabaseClient';

export interface AuthResult<T = void> {
  data: T | null;
  error: string | null;
}

function mapAuthError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();

  if (lower.includes('supabase is not configured')) {
    return raw;
  }
  if (lower.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please verify your credentials and try again.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Please confirm your email address using the verification link sent to your inbox.';
  }
  if (lower.includes('user already registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (lower.includes('password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }
  if (lower.includes('failed to fetch') || lower.includes('networkerror')) {
    return 'Unable to reach Supabase authentication servers. Check your internet connection and VITE_SUPABASE_URL.';
  }

  return raw || 'An unexpected authentication error occurred.';
}

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured;
  },

  async getSession(): Promise<AuthResult<Session>> {
    if (!supabase) {
      return { data: null, error: null };
    }
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return { data: null, error: mapAuthError(error) };
      }
      return { data: data.session, error: null };
    } catch (err) {
      return { data: null, error: mapAuthError(err) };
    }
  },

  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ): () => void {
    if (!supabase) {
      return () => {};
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
  },

  async signUp(
    email: string,
    password: string,
    fullName?: string
  ): Promise<AuthResult<{ user: User | null; session: Session | null }>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: fullName?.trim() ? { full_name: fullName.trim() } : undefined,
        },
      });
      if (error) {
        return { data: null, error: mapAuthError(error) };
      }
      return { data: { user: data.user, session: data.session }, error: null };
    } catch (err) {
      return { data: null, error: mapAuthError(err) };
    }
  },

  async signIn(
    email: string,
    password: string
  ): Promise<AuthResult<{ user: User | null; session: Session | null }>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        return { data: null, error: mapAuthError(error) };
      }
      return { data: { user: data.user, session: data.session }, error: null };
    } catch (err) {
      return { data: null, error: mapAuthError(err) };
    }
  },

  async signOut(): Promise<AuthResult> {
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.signOut();
      if (error) {
        return { data: null, error: mapAuthError(error) };
      }
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: mapAuthError(err) };
    }
  },

  async resetPasswordForEmail(email: string): Promise<AuthResult> {
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        return { data: null, error: mapAuthError(error) };
      }
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: mapAuthError(err) };
    }
  },

  async updatePassword(newPassword: string): Promise<AuthResult<User>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        return { data: null, error: mapAuthError(error) };
      }
      return { data: data.user, error: null };
    } catch (err) {
      return { data: null, error: mapAuthError(err) };
    }
  },
};

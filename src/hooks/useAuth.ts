import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authService } from '../services/authService';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState<boolean>(false);

  const isConfigured = authService.isConfigured();

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      if (!isConfigured) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      const { data, error: sessionError } = await authService.getSession();
      if (!isMounted) {
        return;
      }

      if (sessionError) {
        setError(sessionError);
      }
      setSession(data);
      setUser(data?.user ?? null);
      setLoading(false);
    }

    initAuth();

    const unsubscribe = authService.onAuthStateChange((event, nextSession) => {
      if (!isMounted) {
        return;
      }
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      } else if (event === 'SIGNED_OUT') {
        setIsPasswordRecovery(false);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isConfigured]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    const result = await authService.signIn(email, password);
    if (result.error) {
      setError(result.error);
      return { ok: false, error: result.error };
    }
    return { ok: true, error: null };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName?: string) => {
      setError(null);
      const result = await authService.signUp(email, password, fullName);
      if (result.error) {
        setError(result.error);
        return {
          ok: false,
          error: result.error,
          requiresEmailConfirmation: false,
        };
      }
      const requiresEmailConfirmation = !result.data?.session;
      return { ok: true, error: null, requiresEmailConfirmation };
    },
    []
  );

  const signOut = useCallback(async () => {
    setError(null);
    const result = await authService.signOut();
    if (result.error) {
      setError(result.error);
      return { ok: false, error: result.error };
    }
    setSession(null);
    setUser(null);
    return { ok: true, error: null };
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    setError(null);
    const result = await authService.resetPasswordForEmail(email);
    if (result.error) {
      setError(result.error);
      return { ok: false, error: result.error };
    }
    return { ok: true, error: null };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    setError(null);
    const result = await authService.updatePassword(newPassword);
    if (result.error) {
      setError(result.error);
      return { ok: false, error: result.error };
    }
    setIsPasswordRecovery(false);
    return { ok: true, error: null };
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearPasswordRecovery = useCallback(() => setIsPasswordRecovery(false), []);

  return {
    user,
    session,
    loading,
    error,
    isConfigured,
    isPasswordRecovery,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updatePassword,
    clearError,
    clearPasswordRecovery,
  };
}

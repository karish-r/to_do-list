import { useCallback, useEffect, useState } from 'react';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ToastContainer } from './components/ToastContainer';
import { useAuth } from './hooks/useAuth';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Register } from './pages/Register';
import type { ToastMessage } from './types/task';

export default function App() {
  const {
    user,
    loading,
    isConfigured,
    isPasswordRecovery,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updatePassword,
  } = useAuth();

  const [pathname, setPathname] = useState<string>(
    () => window.location.pathname || '/'
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const navigate = useCallback((nextPath: string, replace = false) => {
    if (window.location.pathname !== nextPath) {
      if (replace) {
        window.history.replaceState({}, '', nextPath);
      } else {
        window.history.pushState({}, '', nextPath);
      }
    }
    setPathname(nextPath);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isPasswordRecovery) {
      if (pathname !== '/reset-password') {
        navigate('/reset-password', true);
      }
      return;
    }

    if (!user) {
      if (pathname === '/' || pathname === '/dashboard') {
        navigate('/login', true);
      }
      return;
    }

    if (
      pathname === '/' ||
      pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/forgot-password' ||
      pathname === '/reset-password'
    ) {
      navigate('/dashboard', true);
    }
  }, [loading, user, isPasswordRecovery, pathname, navigate]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { ...toast, id }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 4500);
    },
    []
  );

  const handleSignOut = useCallback(async () => {
    const result = await signOut();
    if (result.ok) {
      notify({
        type: 'info',
        title: 'Signed out',
        message: 'You have been safely logged out of TaskFlow.',
      });
      navigate('/login', true);
    } else if (result.error) {
      notify({
        type: 'error',
        title: 'Sign out failed',
        message: result.error,
      });
    }
  }, [signOut, notify, navigate]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading TaskFlow..." />;
  }

  let content: React.ReactNode;

  if (isPasswordRecovery) {
    content = (
      <Login
        isConfigured={isConfigured}
        isPasswordRecovery={true}
        initialMode="reset"
        onSignIn={signIn}
        onRequestPasswordReset={requestPasswordReset}
        onUpdatePassword={updatePassword}
        onNavigateRegister={() => navigate('/register')}
        onNavigateLogin={() => navigate('/login')}
      />
    );
  } else if (!user) {
    if (pathname === '/register') {
      content = (
        <Register
          isConfigured={isConfigured}
          onSignUp={signUp}
          onNavigateLogin={() => navigate('/login')}
        />
      );
    } else if (
      pathname === '/' ||
      pathname === '/login' ||
      pathname === '/dashboard' ||
      pathname === '/forgot-password' ||
      pathname === '/reset-password'
    ) {
      const initialMode =
        pathname === '/forgot-password'
          ? 'forgot'
          : pathname === '/reset-password'
          ? 'reset'
          : 'login';
      content = (
        <Login
          isConfigured={isConfigured}
          isPasswordRecovery={false}
          initialMode={initialMode}
          onSignIn={signIn}
          onRequestPasswordReset={requestPasswordReset}
          onUpdatePassword={updatePassword}
          onNavigateRegister={() => navigate('/register')}
          onNavigateLogin={() => navigate('/login')}
        />
      );
    } else {
      content = (
        <NotFound
          isAuthenticated={false}
          onNavigateHome={() => navigate('/login')}
        />
      );
    }
  } else if (
    pathname === '/' ||
    pathname === '/dashboard' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'
  ) {
    content = (
      <Dashboard
        user={user}
        onSignOut={handleSignOut}
        onUpdatePassword={updatePassword}
        onNotify={notify}
      />
    );
  } else {
    content = (
      <NotFound
        isAuthenticated={true}
        onNavigateHome={() => navigate('/dashboard')}
      />
    );
  }

  return (
    <>
      {content}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

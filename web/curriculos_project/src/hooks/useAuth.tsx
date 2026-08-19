import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';

const LEGACY_TOKEN_STORAGE_KEY = 'token';
const LEGACY_USER_STORAGE_KEY = 'user';

function clearBrowserSessionState() {
  try {
    window.sessionStorage.clear();
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

export type User = {
  id: string;
  nome?: string;
  email?: string;
  tipo?: 'usuario' | 'admin' | 'superAdmin' | string;
  possuiCurriculo?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (userData: User) => void;
  signOut: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Remove sessions from the previous localStorage-based implementation.
    localStorage.removeItem(LEGACY_TOKEN_STORAGE_KEY);
    localStorage.removeItem(LEGACY_USER_STORAGE_KEY);

    let active = true;

    api.get<{ user: User }>('/login/session')
      .then((response) => {
        if (active) {
          setUser(response.data.user);
        }
      })
      .catch(() => {
        if (active) {
          clearBrowserSessionState();
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signIn(userData: User) {
        setUser(userData);
      },
      async signOut() {
        try {
          await api.post('/login/logout');
        } catch {
          // A local logout must still complete if the API is unavailable.
        } finally {
          clearBrowserSessionState();
          setUser(null);
        }
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

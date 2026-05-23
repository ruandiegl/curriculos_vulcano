import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { TOKEN_STORAGE_KEY } from '../services/api';

const USER_STORAGE_KEY = 'user';

type User = {
  id: string;
  nome?: string;
  email?: string;
  tipo?: string;
  possuiCurriculo?: boolean;
  iat?: number;
  exp?: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (token: string, userData?: Partial<User>) => void;
  signOut: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

type TokenPayload = {
  id: string;
  tipo?: string;
  iat?: number;
  exp?: number;
};

const AuthContext = createContext<AuthContextType | null>(null);

function getUserFromToken(token: string) {
  const decoded = jwtDecode<TokenPayload>(token);
  const currentTimeInSeconds = Date.now() / 1000;

  if (decoded.exp && decoded.exp <= currentTimeInSeconds) {
    return null;
  }

  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  const storedUserData = storedUser ? JSON.parse(storedUser) as Partial<User> : {};

  return {
    ...storedUserData,
    id: decoded.id,
    tipo: storedUserData.tipo ?? decoded.tipo,
    iat: decoded.iat,
    exp: decoded.exp,
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return null;
    try {
      const storedUser = getUserFromToken(token);
      if (!storedUser) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        return null;
      }
      return storedUser;
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  });

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn(token: string, userData?: Partial<User>) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        if (userData) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
        setUser(getUserFromToken(token));
      },
      signOut() {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
      },
    }),
    [user],
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

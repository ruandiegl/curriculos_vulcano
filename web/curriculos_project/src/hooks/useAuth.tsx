import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { TOKEN_STORAGE_KEY } from '../services/api';

type User = {
  id: string;
  iat?: number;
  exp?: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

type TokenPayload = {
  id: string;
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

  return {
    id: decoded.id,
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
      return null;
    }
    return storedUser;
  } catch {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }
});

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn(token: string) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        setUser(getUserFromToken(token));
      },
      signOut() {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

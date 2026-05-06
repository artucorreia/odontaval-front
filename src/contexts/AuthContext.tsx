import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user data - in production this would come from /api/v1/users/:id
const MOCK_USER: User = {
  id: 'e6f16904-fa64-422a-86f0-1aba11d768f7',
  name: 'Dr. João Silva',
  email: 'joao.silva@odontaval.com',
  roles: [{ id: 1, name: 'PROFESSOR' }],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (storedToken && storedUserId) {
      setToken(storedToken);
      // In production: fetch user from API
      setUser(MOCK_USER);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userId: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', userId);
    setToken(newToken);
    setUser({ ...MOCK_USER, id: userId });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: string) => {
    return user?.roles?.some((r) => r.name === role) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { RoleName, User } from '../types';

type UserRole = 'PROFESSOR' | 'STUDENT';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userId: string, userRole?: RoleName) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_PROFESSOR: User = {
  id: 'e6f16904-fa64-422a-86f0-1aba11d768f7',
  name: 'João Silva',
  email: 'joao.silva@odontaval.com',
  roles: [{ id: 2, name: 'PROFESSOR' }],
};

const MOCK_STUDENT: User = {
  id: 'stu-001',
  name: 'Maria Souza',
  email: 'maria.souza@aluno.edu',
  roles: [{ id: 3, name: 'STUDENT' }],
};

function buildMockUser(userId: string, userRole: RoleName): User {
  const base = userRole === 'STUDENT' ? MOCK_STUDENT : MOCK_PROFESSOR;
  return { ...base, id: userId };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const stored = localStorage.getItem('userRole');
    const storedRole: UserRole = stored === 'STUDENT' ? 'STUDENT' : 'PROFESSOR';
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUser(buildMockUser(storedUserId, storedRole));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userId: string, userRole: RoleName = 'PROFESSOR') => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', userRole);
    setToken(newToken);
    setUser(buildMockUser(userId, userRole));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: string) => user?.roles?.some((r) => r.name === role) ?? false;

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token && !!user, isLoading, login, logout, hasRole }}
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

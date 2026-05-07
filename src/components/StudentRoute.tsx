import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';

export default function StudentRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!hasRole('ALUNO')) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

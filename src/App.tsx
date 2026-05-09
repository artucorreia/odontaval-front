import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProfessorRoute from './components/ProfessorRoute';
import AdminRoute from './components/AdminRoute';
import StudentRoute from './components/StudentRoute';
import AppLayout from './components/AppLayout';
import AdminLayout from './components/AdminLayout';
import StudentLayout from './components/StudentLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import StudentDetailPage from './pages/StudentDetailPage';
import EvaluationsPage from './pages/EvaluationsPage';
import NewEvaluationPage from './pages/NewEvaluationPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/admin/UsersPage';
import SpecialismsPage from './pages/admin/SpecialismsPage';
import AdminEvaluationsPage from './pages/admin/AdminEvaluationsPage';

const theme = {
  token: {
    colorPrimary: '#722ed1',
    controlOutline: '#722ed133',
    controlOutlineWidth: 2,
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
};

export default function App() {
  return (
    <ConfigProvider theme={theme} locale={ptBR}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin area — exclusive for ADMIN role */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="usuarios" element={<UsersPage />} />
              <Route path="usuarios/:id" element={<StudentDetailPage />} />
              <Route path="avaliacoes" element={<AdminEvaluationsPage />} />
              <Route path="especialidades" element={<SpecialismsPage />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="perfil" element={<ProfilePage />} />
            </Route>

            {/* Professor area — blocked for STUDENT and ADMIN */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ProfessorRoute>
                    <AppLayout />
                  </ProfessorRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="alunos" element={<StudentsPage />} />
              <Route path="alunos/:id" element={<StudentDetailPage />} />
              <Route path="avaliacoes" element={<EvaluationsPage />} />
              <Route path="avaliacoes/nova" element={<NewEvaluationPage />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="perfil" element={<ProfilePage />} />
            </Route>

            {/* Student area — minimal layout, blocked for PROFESSOR and ADMIN */}
            <Route
              path="/alunos/me"
              element={
                <ProtectedRoute>
                  <StudentRoute>
                    <StudentLayout />
                  </StudentRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDetailPage />} />
              <Route path="perfil" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

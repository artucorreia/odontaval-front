import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProfessorRoute from './components/ProfessorRoute';
import StudentRoute from './components/StudentRoute';
import AppLayout from './components/AppLayout';
import StudentLayout from './components/StudentLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import StudentDetailPage from './pages/StudentDetailPage';
import ExamsPage from './pages/ExamsPage';
import ExamDetailPage from './pages/ExamDetailPage';
import AgendaPage from './pages/AgendaPage';
import ReportsPage from './pages/ReportsPage';

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

            {/* Professor area — full layout, blocked for ALUNO */}
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
              <Route path="exames" element={<ExamsPage />} />
              <Route path="exames/:id" element={<ExamDetailPage />} />
              <Route path="agenda" element={<AgendaPage />} />
              <Route path="relatorios" element={<ReportsPage />} />
            </Route>

            {/* Student area — minimal layout, blocked for PROFESSOR */}
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
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

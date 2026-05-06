import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import StudentDetailPage from './pages/StudentDetailPage';
import EvaluationsPage from './pages/EvaluationsPage';
import NewEvaluationPage from './pages/NewEvaluationPage';
import EvaluationDetailPage from './pages/EvaluationDetailPage';
import ExamsPage from './pages/ExamsPage';
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
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="alunos" element={<StudentsPage />} />
              <Route path="alunos/:id" element={<StudentDetailPage />} />
              <Route path="avaliacoes" element={<EvaluationsPage />} />
              <Route path="avaliacoes/nova" element={<NewEvaluationPage />} />
              <Route path="avaliacoes/:id" element={<EvaluationDetailPage />} />
              <Route path="avaliacoes/:id/editar" element={<NewEvaluationPage />} />
              <Route path="exames" element={<ExamsPage />} />
              <Route path="agenda" element={<AgendaPage />} />
              <Route path="relatorios" element={<ReportsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

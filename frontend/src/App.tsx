import './App.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './config/queryClient.config';
import { useUIStore } from './store/uiStore';
import { MainLayout } from './components/common/Layout/MainLayout';
import { PrivateRoute } from './components/common/PrivateRoute';
import { Login, Register, ForgotPassword } from './pages/auth';
import { Dashboard } from './pages/dashboard';
import { ProjectsList, ProjectCreate, ProjectEdit, ProjectDetails } from './pages/projects';
import { TasksBoard, TaskCreate, TaskEdit, TaskDetails } from './pages/tasks';

// Pages (to be implemented in later phases)
const UsersList = () => <div>Users List</div>;

function AppContent() {
  const { theme: currentTheme } = useUIStore();

  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/create" element={<ProjectCreate />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="projects/:id/edit" element={<ProjectEdit />} />
            <Route path="projects/:projectId/tasks" element={<TasksBoard />} />
            <Route path="projects/:projectId/tasks/create" element={<TaskCreate />} />
            <Route path="projects/:projectId/tasks/:taskId/edit" element={<TaskEdit />} />
            <Route path="projects/:projectId/tasks/:taskId" element={<TaskDetails />} />
            <Route path="users" element={<UsersList />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
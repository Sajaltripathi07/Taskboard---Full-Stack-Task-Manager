/**
 * App.jsx – root router
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider }      from './context/AuthContext';
import { TaskProvider }      from './context/TaskContext';
import ProtectedRoute        from './routes/ProtectedRoute';
import GuestRoute            from './routes/GuestRoute';
import AuthLayout            from './layouts/AuthLayout';
import DashboardLayout       from './layouts/DashboardLayout';
import LoginPage             from './pages/LoginPage';
import RegisterPage          from './pages/RegisterPage';
import DashboardPage         from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <Routes>
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Guest-only */}
            <Route element={<GuestRoute />}>
              <Route element={<AuthLayout />}>
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
            </Route>

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: 'DM Sans, sans-serif',
                fontSize:   '14px',
                background: '#0F0E11',
                color:      '#F7F5F0',
                borderRadius: '10px',
                padding:    '10px 14px',
              },
              success: { iconTheme: { primary: '#2A9D60', secondary: '#F7F5F0' } },
              error:   { iconTheme: { primary: '#E8552B', secondary: '#F7F5F0' } },
            }}
          />
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

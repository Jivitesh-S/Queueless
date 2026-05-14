import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage, SignupPage } from './pages/AuthPages';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { PublicDisplayPage } from './pages/PublicDisplayPage';
import { QueueManagementPage } from './pages/QueueManagementPage';
import { SettingsPage } from './pages/SettingsPage';
import { TrackingPage } from './pages/TrackingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/user" element={<TrackingPage />} />
      <Route path="/track" element={<TrackingPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/queues" element={<QueueManagementPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/display" element={<PublicDisplayPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

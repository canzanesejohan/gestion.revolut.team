import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Deliveries } from "./pages/Deliveries";
import { Checkins } from "./pages/Checkins";
import { CalendarPage } from "./pages/Calendar";
import { Analytics } from "./pages/Analytics";
import { Templates } from "./pages/Templates";
import { Reports } from "./pages/Reports";
import { SettingsPage } from "./pages/Settings";
import { ProjectDetail } from "./pages/ProjectDetail";
import { useAuth } from "./hooks/useAuth";

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="deliveries" element={<Deliveries />} />
        <Route path="checkins" element={<Checkins />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="templates" element={<Templates />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

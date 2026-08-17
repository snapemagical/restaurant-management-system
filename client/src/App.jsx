import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import api from "./api/axiosClient";
import DashboardShell from "./core/layout/DashboardShell.jsx";
import ProtectedRoute from "./core/auth/ProtectedRoute.jsx";
import LoginPage from "./core/auth/LoginPage.jsx";
import Dashboard from "./core/pages/Dashboard.jsx";
import Profile from "./core/pages/Profile.jsx";
import AuditLogPage from "./core/pages/AuditLogPage.jsx";
import NotFound from "./core/pages/NotFound.jsx";

// Phase 1: core-only routes. The restaurant module's pages (Menu Items,
// Tables, Orders, Payments) get imported and added here in Phase 2.

export default function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    api.get("/config").then((res) => setConfig(res.data.data));
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardShell config={config}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/audit-log"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AuditLogPage />
                    </ProtectedRoute>
                  }
                />

                {/* restaurant module routes land here in Phase 2 */}

                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

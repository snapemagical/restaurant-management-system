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

import MenuItemListPage from "./modules/restaurant/ui/MenuItemListPage.jsx";
import MenuItemFormPage from "./modules/restaurant/ui/MenuItemFormPage.jsx";
import TableListPage from "./modules/restaurant/ui/TableListPage.jsx";
import TableFormPage from "./modules/restaurant/ui/TableFormPage.jsx";
import PaymentListPage from "./modules/restaurant/ui/PaymentListPage.jsx";
import PaymentFormPage from "./modules/restaurant/ui/PaymentFormPage.jsx";
import OrderListPage from "./modules/restaurant/ui/OrderListPage.jsx";
import OrderFormPage from "./modules/restaurant/ui/OrderFormPage.jsx";
import OrderEditPage from "./modules/restaurant/ui/OrderEditPage.jsx";
import MyOrdersPage from "./modules/restaurant/ui/MyOrdersPage.jsx";

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

                {/* restaurant module routes */}
                <Route path="/menu-items" element={<MenuItemListPage />} />
                <Route
                  path="/menu-items/new"
                  element={
                    <ProtectedRoute allowedRoles={["staff"]}>
                      <MenuItemFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/menu-items/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={["staff"]}>
                      <MenuItemFormPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/tables"
                  element={
                    <ProtectedRoute allowedRoles={["staff"]}>
                      <TableListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tables/new"
                  element={
                    <ProtectedRoute allowedRoles={["staff"]}>
                      <TableFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tables/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={["staff"]}>
                      <TableFormPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute allowedRoles={["staff"]}>
                      <PaymentListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments/new"
                  element={
                    <ProtectedRoute allowedRoles={["staff"]}>
                      <PaymentFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={["staff"]}>
                      <PaymentFormPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute allowedRoles={["staff"]}>
                      <OrderListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/new"
                  element={
                    <ProtectedRoute allowedRoles={["staff", "customer"]}>
                      <OrderFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={["staff"]}>
                      <OrderEditPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <MyOrdersPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

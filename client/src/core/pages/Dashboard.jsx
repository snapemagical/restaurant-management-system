import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ menuItems: null, tablesFree: null, activeOrders: null });

  useEffect(() => {
    async function loadCounts() {
      try {
        const menuRes = await api.get("/restaurant/menu-items");
        const menuItems = menuRes.data.data;

        let tablesFree = null;
        if (user.role !== "customer") {
          const tablesRes = await api.get("/restaurant/tables");
          tablesFree = tablesRes.data.data.filter((t) => t.status === "available").length;
        }

        let activeOrders;
        if (user.role === "customer") {
          const mineRes = await api.get("/restaurant/orders/mine");
          activeOrders = mineRes.data.data.filter((o) => ["placed", "preparing", "served"].includes(o.status)).length;
        } else {
          const ordersRes = await api.get("/restaurant/orders");
          activeOrders = ordersRes.data.data.filter((o) => ["placed", "preparing", "served"].includes(o.status)).length;
        }

        setCounts({
          menuItems: menuItems.filter((m) => m.status === "available").length,
          tablesFree,
          activeOrders,
        });
      } catch {
        // endpoint not accessible for this role - fine, just skip
      }
    }
    loadCounts();
  }, [user]);

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <div className="card-grid">
        <div className="card"><h3>Menu Items Available</h3><p>{counts.menuItems ?? "-"}</p></div>
        {user.role !== "customer" && (
          <div className="card"><h3>Tables Free</h3><p>{counts.tablesFree ?? "-"}</p></div>
        )}
        <div className="card"><h3>{user.role === "customer" ? "My Active Orders" : "Active Orders"}</h3><p>{counts.activeOrders ?? "-"}</p></div>
      </div>
    </div>
  );
}

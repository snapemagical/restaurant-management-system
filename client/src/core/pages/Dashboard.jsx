import { useAuth } from "../auth/AuthContext.jsx";

// Generic placeholder - Phase 2 (restaurant module) will add real
// order/table stats here.
export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <p style={{ color: "#667" }}>
        This dashboard will show table/order stats once the restaurant module
        is wired up.
      </p>
    </div>
  );
}

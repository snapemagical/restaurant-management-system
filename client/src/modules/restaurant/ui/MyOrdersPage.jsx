import { useEffect, useState } from "react";
import api from "../../../api/axiosClient";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await api.get("/restaurant/orders/mine");
    setOrders(res.data.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Orders</h2>
      <table>
        <thead>
          <tr><th>Type</th><th>Table</th><th>Items</th><th>Status</th><th>Total</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.orderType}</td>
              <td>{o.tableNumber || "—"}</td>
              <td>{o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}</td>
              <td><span className={`badge ${o.status === "cancelled" ? "overdue" : "active"}`}>{o.status}</span></td>
              <td>${o.totalAmount}</td>
            </tr>
          ))}
          {orders.length === 0 && <tr><td colSpan={5}>No orders yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

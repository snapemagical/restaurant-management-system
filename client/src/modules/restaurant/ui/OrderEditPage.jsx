import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axiosClient";

const STATUS_OPTIONS = ["placed", "preparing", "served", "completed", "cancelled"];

// Editing an order really means moving it through the kitchen/service
// workflow (or cancelling it) - the table's status is kept in sync
// server-side, so this page just shows the order details and a status
// dropdown.
export default function OrderEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/restaurant/orders/${id}`).then((res) => {
      setOrder(res.data.data);
      setStatus(res.data.data.status);
    });
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.put(`/restaurant/orders/${id}`, { status });
      navigate("/orders");
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Something went wrong");
    }
  }

  if (!order) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 480 }}>
      <h2>Order — {order.customerName}</h2>
      <p style={{ fontSize: 14, color: "#667" }}>
        {order.orderType === "dine-in" ? `Table ${order.tableNumber}` : "Takeaway"} ·{" "}
        {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")} · ${order.totalAmount}
      </p>

      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {error && <p className="error-text">{error}</p>}
      <button className="btn" type="submit">Save</button>
    </form>
  );
}

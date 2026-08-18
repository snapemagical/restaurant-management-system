import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosClient";
import { useAuth } from "../../../core/auth/AuthContext.jsx";

// Custom order form (not the generic EntityForm) because building an order
// means picking menu items with quantities and seeing a live running total
// - the same reasoning that made BookingFormPage custom in the Hotel
// Booking reference project.
export default function OrderFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isCustomer = user?.role === "customer";

  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [orderType, setOrderType] = useState("dine-in");
  const [tableId, setTableId] = useState("");
  const [customerName, setCustomerName] = useState(isCustomer ? user.name : "");
  const [quantities, setQuantities] = useState({}); // menuItemId -> qty
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/restaurant/menu-items").then((res) => {
      setMenuItems(res.data.data.filter((m) => m.status === "available"));
    });
    // Customers ordering takeaway don't need to see the table list; staff do.
    if (!isCustomer) {
      api.get("/restaurant/tables").then((res) => {
        setTables(res.data.data.filter((t) => t.status === "available"));
      });
    }
  }, [isCustomer]);

  function setQty(menuItemId, qty) {
    setQuantities((prev) => ({ ...prev, [menuItemId]: qty }));
  }

  const selectedLines = menuItems
    .map((m) => ({ item: m, qty: Number(quantities[m._id]) || 0 }))
    .filter((line) => line.qty > 0);
  const total = selectedLines.reduce((sum, line) => sum + line.item.price * line.qty, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (selectedLines.length === 0) {
      setError("Add at least one item.");
      return;
    }
    try {
      await api.post("/restaurant/orders", {
        orderType,
        tableId: orderType === "dine-in" ? tableId : null,
        customerName,
        items: selectedLines.map((line) => ({ menuItemId: line.item._id, quantity: line.qty })),
      });
      navigate(isCustomer ? "/my-orders" : "/orders");
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 560 }}>
      <h2>New Order</h2>

      {!isCustomer && (
        <div className="form-group">
          <label>Customer Name *</label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        </div>
      )}

      <div className="form-group">
        <label>Order Type *</label>
        <select value={orderType} onChange={(e) => { setOrderType(e.target.value); setTableId(""); }}>
          <option value="dine-in">Dine-in</option>
          <option value="takeaway">Takeaway</option>
        </select>
      </div>

      {orderType === "dine-in" && !isCustomer && (
        <div className="form-group">
          <label>Table *</label>
          <select value={tableId} onChange={(e) => setTableId(e.target.value)} required>
            <option value="" disabled>Select an available table...</option>
            {tables.map((t) => (
              <option key={t._id} value={t._id}>{t.tableNumber} (seats {t.capacity})</option>
            ))}
          </select>
          {tables.length === 0 && <p style={{ fontSize: 12, color: "#991b1b" }}>No tables currently available.</p>}
        </div>
      )}

      <div className="form-group">
        <label>Items</label>
        <table>
          <thead>
            <tr><th>Item</th><th>Price</th><th style={{ width: 90 }}>Qty</th></tr>
          </thead>
          <tbody>
            {menuItems.map((m) => (
              <tr key={m._id}>
                <td>{m.name} <span style={{ color: "#899", fontSize: 12 }}>({m.category})</span></td>
                <td>${m.price}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={quantities[m._id] ?? ""}
                    onChange={(e) => setQty(m._id, e.target.value)}
                    style={{ width: 60 }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLines.length > 0 && (
        <p style={{ fontSize: 14, marginBottom: 14 }}>
          {selectedLines.map((l) => `${l.qty}× ${l.item.name}`).join(", ")} = <strong>${total}</strong>
        </p>
      )}

      {error && <p className="error-text">{error}</p>}
      <button className="btn" type="submit">Place Order</button>
    </form>
  );
}

// Orders aren't plain CRUD: creating one has to look up each menu item's
// current price and compute the total, and a status change can have a
// side-effect on the table (same shape as booking.routes.js in the Hotel
// Booking reference project).
const router = require("express").Router();
const requireAuth = require("../../core/auth/auth.middleware");
const requireRole = require("../../core/rbac/requireRole");
const { logAction } = require("../../core/audit/auditLogger");
const MenuItem = require("./menuItem.model");
const Table = require("./table.model");
const Order = require("./order.model");

// GET /api/restaurant/orders - staff / admin see everything
router.get("/", requireAuth, requireRole(["staff"]), async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ data: orders });
});

// GET /api/restaurant/orders/mine - a logged-in customer's own orders
router.get("/mine", requireAuth, requireRole(["customer"]), async (req, res) => {
  const orders = await Order.find({ customerUserId: req.user.userId }).sort({ createdAt: -1 });
  res.json({ data: orders });
});

// GET /api/restaurant/orders/:id
router.get("/:id", requireAuth, requireRole(["staff"]), async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Order not found" } });
  res.json({ data: order });
});

// POST /api/restaurant/orders - staff (dine-in/takeaway for a walk-in) or a
// customer (self-service). Body: { orderType, tableId?, customerName?, items: [{menuItemId, quantity}] }
router.post("/", requireAuth, requireRole(["staff", "customer"]), async (req, res) => {
  try {
    const { orderType, tableId, items } = req.body;
    let { customerName } = req.body;

    if (!orderType || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "orderType and at least one item are required" } });
    }
    if (orderType === "dine-in" && !tableId) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "tableId is required for dine-in orders" } });
    }

    // Look up each menu item's current price server-side - never trust a
    // client-supplied price.
    let resolvedItems;
    try {
      resolvedItems = await Promise.all(
        items.map(async ({ menuItemId, quantity }) => {
          const menuItem = await MenuItem.findById(menuItemId);
          if (!menuItem) throw new Error("One of the selected menu items no longer exists");
          if (menuItem.status !== "available") throw new Error(`${menuItem.name} is currently unavailable`);
          const qty = Number(quantity) || 1;
          return { menuItemId: menuItem._id, name: menuItem.name, price: menuItem.price, quantity: qty };
        })
      );
    } catch (err) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }

    const totalAmount = resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let table = null;
    if (tableId) {
      table = await Table.findById(tableId);
      if (!table) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Table not found" } });
      if (table.status !== "available") {
        return res.status(409).json({ error: { code: "CONFLICT", message: `Table ${table.tableNumber} is not available` } });
      }
    }

    // A logged-in customer can only ever order for themself.
    let customerUserId = null;
    if (req.user.role === "customer") {
      customerUserId = req.user.userId;
      customerName = req.user.name;
    }

    const order = await Order.create({
      orderType,
      tableId: table?._id || null,
      tableNumber: table?.tableNumber || null,
      customerName,
      customerUserId,
      items: resolvedItems,
      totalAmount,
      status: "placed",
    });

    if (table) {
      await Table.findByIdAndUpdate(table._id, { status: "occupied" });
    }

    await logAction(req.user, "CREATE", "Order", order._id);
    res.status(201).json({ data: order });
  } catch (err) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
  }
});

// PUT /api/restaurant/orders/:id - status changes; completing/cancelling a
// dine-in order frees its table back up.
router.put("/:id", requireAuth, requireRole(["staff"]), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Order not found" } });

    const { status } = req.body;
    if (status) order.status = status;
    await order.save();

    if ((status === "completed" || status === "cancelled") && order.tableId) {
      await Table.findByIdAndUpdate(order.tableId, { status: "available" });
    }

    await logAction(req.user, "UPDATE", "Order", order._id);
    res.json({ data: order });
  } catch (err) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
  }
});

// DELETE /api/restaurant/orders/:id - admin only in practice (requireRole([]) + admin bypass)
router.delete("/:id", requireAuth, requireRole([]), async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Order not found" } });
  await logAction(req.user, "DELETE", "Order", req.params.id);
  res.json({ data: { id: req.params.id } });
});

module.exports = router;

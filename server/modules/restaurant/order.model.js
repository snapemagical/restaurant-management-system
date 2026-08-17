const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true }, // denormalized so the order still reads fine if the menu changes later
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderType: { type: String, enum: ["dine-in", "takeaway"], required: true },

    tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", default: null },
    tableNumber: { type: String, default: null }, // denormalized for easy display

    customerName: { type: String, required: true, trim: true },
    // Set automatically when a logged-in "customer" role user places their own order.
    customerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["placed", "preparing", "served", "completed", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

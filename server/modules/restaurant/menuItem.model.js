const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ["Starter", "Main", "Dessert", "Beverage"], required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["available", "unavailable"], default: "available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);

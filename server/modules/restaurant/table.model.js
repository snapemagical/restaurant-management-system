const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: String, required: true, unique: true, trim: true },
    capacity: { type: Number, required: true },
    status: { type: String, enum: ["available", "occupied", "reserved"], default: "available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);

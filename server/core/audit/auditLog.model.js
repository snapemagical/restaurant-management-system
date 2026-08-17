const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: String,
    action: { type: String, required: true }, // CREATE | UPDATE | DELETE
    entity: { type: String, required: true }, // "Room", "Order", etc.
    entityId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);

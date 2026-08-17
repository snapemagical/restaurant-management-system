const router = require("express").Router();
const requireAuth = require("../auth/auth.middleware");
const requireRole = require("../rbac/requireRole");
const AuditLog = require("./auditLog.model");

router.get("/", requireAuth, requireRole(["admin"]), async (req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200);
  res.json({ data: logs });
});

module.exports = router;

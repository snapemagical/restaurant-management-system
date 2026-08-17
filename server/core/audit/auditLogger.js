const AuditLog = require("./auditLog.model");

async function logAction(user, action, entity, entityId) {
  try {
    await AuditLog.create({
      userId: user?.userId,
      userName: user?.name,
      action,
      entity,
      entityId,
    });
  } catch (err) {
    console.error("Failed to write audit log:", err.message);
  }
}

module.exports = { logAction };

// Usage: router.post("/", requireAuth, requireRole(["admin", "staff"]), handler)
function requireRole(allowedRoles) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    }
    if (req.user.role === "admin") {
      // Admin can always act, so modules don't need to remember to list "admin" every time.
      return next();
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "You don't have permission to do this" } });
    }
    next();
  };
}

module.exports = requireRole;

const jwt = require("jsonwebtoken");

// Verifies the Bearer token and attaches { userId, role } to req.user.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No token provided" } });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, role: payload.role, name: payload.name };
    next();
  } catch (err) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid or expired token" } });
  }
}

module.exports = requireAuth;

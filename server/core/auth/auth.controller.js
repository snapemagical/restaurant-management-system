const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { getConfig } = require("../config");

function signToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "name, email, password, role are required" } });
    }
    const config = getConfig();
    if (!config.roles.includes(role)) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: `role must be one of: ${config.roles.join(", ")}` } });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: { code: "VALIDATION_ERROR", message: "Email already registered" } });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role });
    const token = signToken(user);
    res.status(201).json({ data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "email and password are required" } });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials" } });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials" } });
    }
    const token = signToken(user);
    res.json({ data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
}

// GET /api/auth/me
async function me(req, res) {
  const user = await User.findById(req.user.userId).select("-passwordHash");
  if (!user) return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
  res.json({ data: user });
}

module.exports = { register, login, me };

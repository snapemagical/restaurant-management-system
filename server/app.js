const express = require("express");
const cors = require("cors");
const { getConfig } = require("./core/config");
const authRoutes = require("./core/auth/auth.routes");
const auditRoutes = require("./core/audit/audit.routes");
const { loadModules } = require("./modules");

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const config = getConfig();

  app.use("/api/auth", authRoutes);
  app.use("/api/audit-logs", auditRoutes);

  const nav = loadModules(app);

  app.get("/api/config", (req, res) => {
    res.json({
      data: {
        appName: config.appName,
        logoUrl: config.logoUrl,
        primaryColor: config.primaryColor,
        roles: config.roles,
        roleLabels: config.roleLabels,
        nav,
      },
    });
  });

  app.use((req, res) => {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
  });

  return app;
}

module.exports = { createApp };

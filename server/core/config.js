// Loads the active project's config once at boot and exposes it everywhere.
const projectConfig = require("../config/project.config");

function getConfig() {
  return projectConfig;
}

function isModuleEnabled(moduleId) {
  return projectConfig.enabledModules.includes(moduleId);
}

module.exports = { getConfig, isModuleEnabled };

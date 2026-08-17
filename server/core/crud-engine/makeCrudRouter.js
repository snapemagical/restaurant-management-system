const router_ = require("express").Router;
const requireAuth = require("../auth/auth.middleware");
const requireRole = require("../rbac/requireRole");
const { list, getOne, create, update, remove } = require("./crudController");

// Given a Mongoose Model and a schema descriptor, generates a full set of
// REST routes with RBAC already applied. Modules can still add custom routes
// on top - see restaurant/order.routes.js for an example.
function makeCrudRouter(Model, schema) {
  const router = router_();
  const roles = schema.roles || {};

  router.get("/", requireAuth, requireRole(roles.read || []), list(Model));
  router.get("/:id", requireAuth, requireRole(roles.read || []), getOne(Model));
  router.post("/", requireAuth, requireRole(roles.create || []), create(Model, schema.name));
  router.put("/:id", requireAuth, requireRole(roles.update || []), update(Model, schema.name));
  router.delete("/:id", requireAuth, requireRole(roles.delete || []), remove(Model, schema.name));

  return router;
}

module.exports = makeCrudRouter;

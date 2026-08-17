const makeCrudRouter = require("../../core/crud-engine/makeCrudRouter");
const MenuItem = require("./menuItem.model");
const schema = require("./menuItem.schema");

module.exports = makeCrudRouter(MenuItem, schema);

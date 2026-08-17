const makeCrudRouter = require("../../core/crud-engine/makeCrudRouter");
const Table = require("./table.model");
const schema = require("./table.schema");

module.exports = makeCrudRouter(Table, schema);

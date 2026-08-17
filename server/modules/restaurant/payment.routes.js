const makeCrudRouter = require("../../core/crud-engine/makeCrudRouter");
const Payment = require("./payment.model");
const schema = require("./payment.schema");

module.exports = makeCrudRouter(Payment, schema);

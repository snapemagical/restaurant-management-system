const { logAction } = require("../audit/auditLogger");

function list(Model) {
  return async (req, res) => {
    try {
      const { search, page = 1, limit = 20 } = req.query;
      const query = {};
      if (search) {
        const stringFields = Object.keys(Model.schema.paths).filter(
          (key) => Model.schema.paths[key].instance === "String"
        );
        query.$or = stringFields.map((field) => ({ [field]: { $regex: search, $options: "i" } }));
      }
      const skip = (Number(page) - 1) * Number(limit);
      const [items, total] = await Promise.all([
        Model.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
        Model.countDocuments(query),
      ]);
      res.json({ data: items, meta: { total, page: Number(page), limit: Number(limit) } });
    } catch (err) {
      res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
    }
  };
}

function getOne(Model) {
  return async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
      res.json({ data: item });
    } catch (err) {
      res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
    }
  };
}

function create(Model, entityName) {
  return async (req, res) => {
    try {
      const item = await Model.create(req.body);
      await logAction(req.user, "CREATE", entityName, item._id);
      res.status(201).json({ data: item });
    } catch (err) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }
  };
}

function update(Model, entityName) {
  return async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
      await logAction(req.user, "UPDATE", entityName, item._id);
      res.json({ data: item });
    } catch (err) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }
  };
}

function remove(Model, entityName) {
  return async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
      await logAction(req.user, "DELETE", entityName, item._id);
      res.json({ data: { id: req.params.id } });
    } catch (err) {
      res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
    }
  };
}

module.exports = { list, getOne, create, update, remove };

module.exports = {
  name: "Table",
  roles: {
    read: ["admin", "staff"],
    create: ["staff"],
    update: ["staff"],
    delete: ["staff"],
  },
};

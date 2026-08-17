module.exports = {
  name: "MenuItem",
  roles: {
    read: ["admin", "staff", "customer"], // customers browse the menu read-only
    create: ["staff"],
    update: ["staff"],
    delete: ["staff"],
  },
};

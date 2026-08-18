export default {
  name: "Table",
  roles: {
    create: ["staff"],
    update: ["staff"],
    delete: ["staff"],
  },
  listFields: ["tableNumber", "capacity", "status"],
  fields: {
    tableNumber: { label: "Table Number", required: true },
    capacity: { label: "Capacity", type: "Number", required: true },
    status: { label: "Status", enum: ["available", "occupied", "reserved"], default: "available", required: true },
  },
};

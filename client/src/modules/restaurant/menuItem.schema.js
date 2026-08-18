export default {
  name: "Menu Item",
  roles: {
    create: ["staff"],
    update: ["staff"],
    delete: ["staff"],
  },
  listFields: ["name", "category", "price", "status"],
  fields: {
    name: { label: "Name", required: true },
    category: { label: "Category", enum: ["Starter", "Main", "Dessert", "Beverage"], required: true },
    price: { label: "Price", type: "Number", required: true },
    status: { label: "Status", enum: ["available", "unavailable"], default: "available", required: true },
  },
};

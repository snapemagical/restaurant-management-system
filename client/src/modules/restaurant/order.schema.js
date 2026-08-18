// Orders aren't rendered with the generic EntityForm (see OrderFormPage /
// OrderEditPage) because creating one needs a menu item picker with
// quantities, and editing one is really just a status change. This schema
// still powers the generic EntityList table (column labels + role checks).
export default {
  name: "Order",
  roles: {
    create: ["staff"],
    update: ["staff"],
    delete: [], // admin only, via the automatic admin bypass
  },
  listFields: ["customerName", "orderType", "tableNumber", "status", "totalAmount"],
  fields: {
    customerName: { label: "Customer" },
    orderType: { label: "Type" },
    tableNumber: { label: "Table" },
    status: { label: "Status" },
    totalAmount: { label: "Total" },
  },
};

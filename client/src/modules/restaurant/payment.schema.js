export default {
  name: "Payment",
  roles: {
    create: ["staff"],
    update: ["staff"],
    delete: ["staff"],
  },
  listFields: ["orderId", "amount", "method", "status"],
  fields: {
    orderId: { label: "Order ID", required: true },
    amount: { label: "Amount", type: "Number", required: true },
    method: { label: "Method", enum: ["cash", "card", "upi"], required: true },
    status: { label: "Status", enum: ["pending", "paid", "refunded"], default: "pending", required: true },
  },
};

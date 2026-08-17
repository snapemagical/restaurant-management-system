module.exports = [
  { label: "Menu Items", path: "/menu-items", icon: "menu-item", roles: ["admin", "staff", "customer"] },
  { label: "Tables", path: "/tables", icon: "tables", roles: ["admin", "staff"] },
  { label: "Orders", path: "/orders", icon: "orders", roles: ["admin", "staff"] },
  { label: "Payments", path: "/payments", icon: "payments", roles: ["admin", "staff"] },
  { label: "My Orders", path: "/my-orders", icon: "orders", roles: ["customer"] },
];

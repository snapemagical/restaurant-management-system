// Creates demo accounts + sample menu items/tables so you can log in and
// test right away. Run with: npm run seed  (from the server/ directory)
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const MenuItem = require("../modules/restaurant/menuItem.model");
const Table = require("../modules/restaurant/table.model");

const DEMO_PASSWORD = "password123";

async function upsertUser(name, email, role) {
  const existing = await User.findOne({ email });
  if (existing) return existing;
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  return User.create({ name, email, passwordHash, role });
}

async function upsertMenuItem(name, category, price, status = "available") {
  const existing = await MenuItem.findOne({ name });
  if (existing) return existing;
  return MenuItem.create({ name, category, price, status });
}

async function upsertTable(tableNumber, capacity, status = "available") {
  const existing = await Table.findOne({ tableNumber });
  if (existing) return existing;
  return Table.create({ tableNumber, capacity, status });
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB - seeding demo data...");

  await upsertUser("Admin", "admin@demo.com", "admin");
  await upsertUser("Staff", "staff@demo.com", "staff");
  await upsertUser("Demo Customer", "customer@demo.com", "customer");

  await upsertMenuItem("Spring Rolls", "Starter", 6);
  await upsertMenuItem("Garlic Bread", "Starter", 5);
  await upsertMenuItem("Margherita Pizza", "Main", 12);
  await upsertMenuItem("Grilled Chicken", "Main", 15);
  await upsertMenuItem("Chocolate Lava Cake", "Dessert", 7);
  await upsertMenuItem("Iced Tea", "Beverage", 3);
  await upsertMenuItem("Seasonal Soup", "Starter", 6, "unavailable");

  await upsertTable("T1", 2);
  await upsertTable("T2", 4);
  await upsertTable("T3", 4, "reserved");
  await upsertTable("T4", 6);

  console.log("Done. Demo accounts (password: password123):");
  console.log("  admin@demo.com");
  console.log("  staff@demo.com");
  console.log("  customer@demo.com");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});

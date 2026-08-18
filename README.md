# Restaurant Management System
### (Instructor reference — Phase 2: restaurant module complete)

A working MERN application built on a reusable **core** (auth, RBAC, generic
CRUD engine, notifications, audit log) plus a **restaurant** domain module
(Menu Items, Tables, Orders, Payments). Follows the same platform pattern as
the Smart Library Management and Hotel Booking reference projects.

## Prerequisites
- Node.js 18+
- MongoDB running locally (or an Atlas connection string)

## 1. Server setup
```
cd server
npm install
cp .env.example .env      # then edit .env with your Mongo URI + JWT secret
npm run seed                # creates demo admin/staff/customer accounts + sample menu items/tables
npm run dev                 # starts the API on http://localhost:5000
```

## 2. Client setup
```
cd client
npm install
npm run dev                 # starts the React app on http://localhost:5173
```

## 3. Log in
Open http://localhost:5173 and sign in with one of the seeded demo accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@demo.com | password123 |
| Staff | staff@demo.com | password123 |
| Customer | customer@demo.com | password123 |

## What to try
- Log in as **staff**: add/edit Menu Items and Tables, place a dine-in
  order (pick a table + items with quantities — total is calculated live
  from price × quantity), then open the order again to move it through
  `placed` → `preparing` → `served` → `completed`. Completing or
  cancelling a dine-in order frees its table back up to `available`.
  Record a Payment against an order.
- Log in as **customer**: browse the Menu (read-only), place a takeaway
  or dine-in order for yourself under **My Orders** and watch its status
  update as staff moves it along.
- Log in as **admin**: everything above, plus the Audit Log, plus the only
  role that can delete an order outright.

## Project layout
```
server/
  core/                - auth, RBAC, generic CRUD engine, audit log, notifications (module-agnostic)
  config/              - project.config.js: app name, roles, enabled modules
  models/              - User model
  modules/
    index.js           - module registry (mounts restaurant's routes + nav)
    restaurant/         - MenuItem/Table/Payment (generic CRUD) + Order (custom: price lookup, total calc, table sync)
  seed/                 - demo accounts + sample menu items/tables
client/
  src/core/             - auth context/pages, generic CRUD-driven EntityList/EntityForm, layout
  src/components/       - shadcn/ui primitives + the app's Sidebar
  src/modules/
    restaurant/ui/       - MenuItem/Table/Payment list+form pages (generic), Order pages (custom)
```

## Design notes worth walking through with students
- **Menu Items, Tables, Payments** are plain CRUD — their entire UI is
  just a schema object (`menuItem.schema.js` etc.) fed into the shared
  `EntityList` / `EntityForm` components. No new UI code was written for
  them.
- **Orders** are *not* plain CRUD: creating one needs to look up each
  selected menu item's current price server-side (never trust a
  client-supplied price), validate table availability for dine-in, and
  compute the total from `price × quantity` summed across items; changing
  status has a side-effect on the table. That's why Orders get their own
  routes (`order.routes.js`) and their own pages (`OrderFormPage`,
  `OrderEditPage`) instead of the generic ones.
- **RBAC** is enforced in two places on purpose: the server is the source
  of truth (`requireRole` on every route), the client's `EntityList`
  hides buttons the user can't use — but only as a UX nicety, never as
  the actual security boundary.
- Everything under `server/core/` and `client/src/core/` is byte-for-byte
  reusable for a fourth project — only `modules/` and `App.jsx`'s route
  list change.

## Turning this into a different project
Same recipe as `docs/adding-a-module.md` in the Library reference project:
add a new module folder, one entry in `server/modules/index.js`, one set of
imports/routes in `client/src/App.jsx`, update `project.config.js`. Nothing
under `core/` needs to change.

import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Grid3x3,
  ClipboardList,
  CreditCard,
  UserCircle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "@/core/auth/AuthContext.jsx";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Maps icon keys coming from each module's nav.js to a lucide-react component.
// The restaurant module (Phase 2) will use these keys.
const ICONS = {
  "menu-item": UtensilsCrossed,
  tables: Grid3x3,
  orders: ClipboardList,
  payments: CreditCard,
};

export function AppSidebar({ config, ...props }) {
  const { user } = useAuth();
  const location = useLocation();

  const visibleNav = (config?.nav || []).filter(
    (item) => user?.role === "admin" || item.roles.includes(user?.role)
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-semibold">
            {(config?.appName || "R").charAt(0)}
          </div>
          <span className="truncate text-sm font-semibold group-data-[state=collapsed]:hidden">
            {config?.appName || "Restaurant Management System"}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/dashboard"} tooltip="Dashboard">
                  <NavLink to="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {visibleNav.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Modules</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleNav.map((item) => {
                  const Icon = ICONS[item.icon] || ChevronRight;
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.path} tooltip={item.label}>
                        <NavLink to={item.path}>
                          <Icon />
                          <span>{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/profile"} tooltip="My Profile">
                  <NavLink to="/profile">
                    <UserCircle />
                    <span>My Profile</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {user?.role === "admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/audit-log"} tooltip="Audit Log">
                    <NavLink to="/audit-log">
                      <ShieldCheck />
                      <span>Audit Log</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

import { AppSidebar } from "@/components/app-sidebar.jsx";
import { SidebarProvider, SidebarInset, TooltipProvider } from "@/components/ui/sidebar";
import Topbar from "./Topbar.jsx";

export default function DashboardShell({ config, children }) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <AppSidebar config={config} />
        <SidebarInset>
          <Topbar />
          <div className="content">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

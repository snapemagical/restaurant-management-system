import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="topbar">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <span>Welcome, {user?.name} ({user?.role})</span>
      </div>
      <button className="btn secondary" onClick={handleLogout}>Logout</button>
    </div>
  );
}

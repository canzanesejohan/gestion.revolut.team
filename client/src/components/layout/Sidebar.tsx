import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ClipboardCheck,
  Calendar,
  BarChart3,
  FileText,
  FolderKanban,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/deliveries", icon: Package, label: "Entregas" },
  { to: "/checkins", icon: ClipboardCheck, label: "Check-ins" },
  { to: "/calendar", icon: Calendar, label: "Calendario" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/templates", icon: FolderKanban, label: "Plantillas" },
  { to: "/reports", icon: FileText, label: "Reportes" },
  { to: "/users", icon: Users, label: "Equipo" },
  { to: "/settings", icon: Settings, label: "Configuracion" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-lg font-bold text-primary-700">Revolut Team</h1>
      </div>
      <nav className="mt-4 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

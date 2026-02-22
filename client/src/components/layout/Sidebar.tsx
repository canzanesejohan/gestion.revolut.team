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
  X,
  Sparkles,
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

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const handleClose = () => onClose?.();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={handleClose} />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col border-r border-gray-200/80 bg-white transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-gray-900">Revolut Team</h1>
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Productivity Suite</p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 hover:bg-gray-100 lg:hidden">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={handleClose}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all",
                    isActive
                      ? "bg-primary-50 text-primary-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                      isActive
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                    )}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-600" />
              <p className="text-xs font-semibold text-gray-700">Claude AI Integrado</p>
            </div>
            <p className="mt-1 text-[11px] text-gray-500">Asistente inteligente para tu equipo</p>
          </div>
        </div>
      </aside>
    </>
  );
}

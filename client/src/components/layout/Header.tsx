import { LogOut, Search, Menu } from "lucide-react";
import { NotificationPanel } from "../notifications/NotificationPanel";
import { useAuthStore } from "../../stores/authStore";
import { getInitials } from "../../lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();

  return (
    <header className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/80 px-4 backdrop-blur-xl left-0 lg:left-[270px] lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-2 hover:bg-gray-100 lg:hidden">
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        <div className="relative hidden w-80 sm:block lg:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar entregas, proyectos..."
            className="input py-2 pl-10 pr-4"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationPanel />

        <div className="hidden h-6 w-px bg-gray-200 sm:block" />

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-semibold text-white shadow-sm">
            {user ? getInitials(user.name) : "?"}
          </div>
          <div className="hidden text-sm sm:block">
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-[11px] text-gray-400">{user?.role}</p>
          </div>
          <button onClick={logout} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Cerrar sesion">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

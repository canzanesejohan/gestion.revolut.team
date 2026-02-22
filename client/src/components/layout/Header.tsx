import { LogOut, Search } from "lucide-react";
import { NotificationPanel } from "../notifications/NotificationPanel";
import { useAuthStore } from "../../stores/authStore";
import { getInitials } from "../../lib/utils";

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar entregas, proyectos..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <NotificationPanel />

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white">
            {user ? getInitials(user.name) : "?"}
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <button onClick={logout} className="rounded-lg p-2 hover:bg-gray-100" title="Cerrar sesion">
            <LogOut className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
}

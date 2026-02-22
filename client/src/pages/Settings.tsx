import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { User, Bell, Shield, Save, Check } from "lucide-react";
import api from "../services/api";

export function SettingsPage() {
  const { user } = useAuthStore();
  const [telegramId, setTelegramId] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security">("profile");

  const handleSaveTelegram = async () => {
    try {
      await api.put(`/users/${user?.id}`, { telegramChatId: telegramId });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { key: "profile" as const, label: "Perfil", icon: User },
    { key: "notifications" as const, label: "Notificaciones", icon: Bell },
    { key: "security" as const, label: "Seguridad", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">Configuracion</h1>
        <p className="mt-1 text-sm text-gray-500">Ajustes de tu cuenta y la plataforma</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-56">
          <nav className="flex gap-1 lg:flex-col">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Perfil</h2>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-xl font-bold text-white">
                  {user?.name?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="text-lg font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className="badge bg-primary-50 text-primary-700 mt-1">{user?.role}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Notificaciones Telegram</h2>
              <p className="text-sm text-gray-500">
                Recibe alertas en tiempo real via Telegram. Busca tu bot en Telegram,
                envia <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">/start</code> y
                luego <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">/id</code> para obtener tu Chat ID.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="Tu Telegram Chat ID"
                  className="input max-w-sm"
                />
                <button onClick={handleSaveTelegram} className="btn-primary">
                  {saved ? <><Check className="h-4 w-4" /> Guardado</> : <><Save className="h-4 w-4" /> Guardar</>}
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Seguridad</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div>
                    <p className="font-medium text-gray-900">Autenticacion JWT</p>
                    <p className="text-sm text-gray-500">Token de acceso con refresh automatico</p>
                  </div>
                  <span className="badge bg-green-100 text-green-700">Activo</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div>
                    <p className="font-medium text-gray-900">Sesion actual</p>
                    <p className="text-sm text-gray-500">Navegador web - Activa ahora</p>
                  </div>
                  <span className="badge bg-blue-100 text-blue-700">Conectado</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

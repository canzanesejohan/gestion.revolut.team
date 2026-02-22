export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuracion</h1>
        <p className="text-sm text-gray-500">Ajustes de la plataforma</p>
      </div>
      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">Telegram Bot</h2>
        <p className="mt-2 text-sm text-gray-500">
          Para recibir notificaciones por Telegram, busca @TuBotName en Telegram
          y envia /start. Luego pega tu Chat ID aqui.
        </p>
        <input
          type="text"
          placeholder="Tu Telegram Chat ID"
          className="mt-3 w-full max-w-md rounded-lg border px-3 py-2 text-sm"
        />
        <button className="mt-3 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
          Guardar
        </button>
      </div>
    </div>
  );
}

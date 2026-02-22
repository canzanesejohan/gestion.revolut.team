import { useEffect, useState } from "react";
import { useCheckinStore } from "../stores/checkinStore";
import { useAuthStore } from "../stores/authStore";
import { formatDate, getInitials } from "../lib/utils";
import api from "../services/api";

const moodEmojis = ["", "\u{1F61F}", "\u{1F610}", "\u{1F642}", "\u{1F60A}", "\u{1F680}"];

export function Checkins() {
  const { checkins, summary, fetchCheckins, fetchSummary } = useCheckinStore();
  const user = useAuthStore((s) => s.user);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    projectId: "",
    accomplished: "",
    planned: "",
    mood: 3,
    blockers: [] as string[],
  });
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchCheckins();
    fetchSummary();
    api.get("/projects").then(({ data }) =>
      setProjects(data.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })))
    );
  }, [fetchCheckins, fetchSummary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/checkins", {
      ...form,
      blockers: form.blockers.filter(Boolean).map((b) => ({ description: b })),
    });
    setShowForm(false);
    setForm({ projectId: "", accomplished: "", planned: "", mood: 3, blockers: [] });
    fetchCheckins();
    fetchSummary();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Check-ins Diarios</h1>
          <p className="text-sm text-gray-500">Reportes diarios del equipo</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          {showForm ? "Cancelar" : "+ Mi Check-in"}
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Check-ins hoy</p>
            <p className="text-2xl font-bold">
              {summary.todayCheckins}/{summary.totalMembers}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Tasa completado</p>
            <p className="text-2xl font-bold">{summary.completionRate}%</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Mood promedio</p>
            <p className="text-2xl font-bold">{moodEmojis[Math.round(summary.avgMood)] || "-"}</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Bloqueos activos</p>
            <p className="text-2xl font-bold text-orange-600">{summary.unresolvedBlockers}</p>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Check-in de {user?.name}</h2>
          <select
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Seleccionar proyecto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <textarea
            placeholder="Que lograste ayer?"
            value={form.accomplished}
            onChange={(e) => setForm({ ...form, accomplished: e.target.value })}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
            rows={2}
          />
          <textarea
            placeholder="Que planeas hacer hoy?"
            value={form.planned}
            onChange={(e) => setForm({ ...form, planned: e.target.value })}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
            rows={2}
          />
          <div>
            <label className="text-sm font-medium text-gray-700">Estado de animo</label>
            <div className="mt-1 flex gap-2">
              {[1, 2, 3, 4, 5].map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setForm({ ...form, mood })}
                  className={`text-2xl ${form.mood === mood ? "scale-125" : "opacity-50"}`}
                >
                  {moodEmojis[mood]}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
            Enviar Check-in
          </button>
        </form>
      )}

      <div className="space-y-3">
        {checkins.map((c) => (
          <div key={c.id} className="rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                  {getInitials(c.user.name)}
                </div>
                <div>
                  <p className="text-sm font-medium">{c.user.name}</p>
                  <p className="text-xs text-gray-500">{c.project.name} · {formatDate(c.date)}</p>
                </div>
              </div>
              <span className="text-xl">{moodEmojis[c.mood]}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-green-700">Logrado</p>
                <p className="text-gray-600">{c.accomplished}</p>
              </div>
              <div>
                <p className="font-medium text-blue-700">Planeado</p>
                <p className="text-gray-600">{c.planned}</p>
              </div>
            </div>
            {c.blockers.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-orange-700">Bloqueos</p>
                {c.blockers.map((b) => (
                  <p key={b.id} className="text-sm text-gray-600">
                    {b.isResolved ? "\u2705" : "\u{1F6A7}"} {b.description}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

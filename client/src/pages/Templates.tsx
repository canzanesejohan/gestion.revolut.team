import { useEffect, useState } from "react";
import api from "../services/api";
import { FolderKanban, Plus, Clock, Target, Copy } from "lucide-react";
import { Modal } from "../components/ui/Modal";
import { useAuthStore } from "../stores/authStore";

interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  milestones: { name: string; description?: string; durationDays: number; order: number }[];
  createdAt: string;
}

export function Templates() {
  const { user } = useAuthStore();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "DEVELOPMENT" });
  const isManager = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    api.get("/templates").then(({ data }) => setTemplates(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/templates", { ...form, milestones: [] });
      setTemplates((prev) => [data, ...prev]);
      setShowCreate(false);
      setForm({ name: "", description: "", category: "DEVELOPMENT" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUseTemplate = async (templateId: string) => {
    try {
      await api.post("/templates/from-template", {
        templateId,
        projectName: `Nuevo desde plantilla`,
        startDate: new Date().toISOString(),
      });
      alert("Proyecto creado desde plantilla");
    } catch (err) {
      console.error(err);
    }
  };

  const categoryColors: Record<string, string> = {
    DEVELOPMENT: "bg-blue-100 text-blue-700",
    DESIGN: "bg-purple-100 text-purple-700",
    MARKETING: "bg-green-100 text-green-700",
    OPERATIONS: "bg-orange-100 text-orange-700",
  };

  if (loading) return <p className="py-12 text-center text-gray-500">Cargando plantillas...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">Plantillas</h1>
          <p className="mt-1 text-sm text-gray-500">Biblioteca de plantillas de proyectos reutilizables</p>
        </div>
        {isManager && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus className="h-4 w-4" />
            Nueva Plantilla
          </button>
        )}
      </div>

      {templates.length === 0 ? (
        <div className="card py-16 text-center">
          <FolderKanban className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 font-semibold text-gray-900">Sin plantillas</h3>
          <p className="mt-1 text-sm text-gray-500">Crea plantillas para agilizar la creacion de proyectos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div key={t.id} className="card-hover p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{t.name}</h3>
                  {t.description && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{t.description}</p>}
                </div>
                <span className={`badge ${categoryColors[t.category] || "bg-gray-100 text-gray-600"}`}>
                  {t.category}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Target className="h-3 w-3" />{t.milestones.length} hitos</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {t.milestones.reduce((a, m) => a + m.durationDays, 0)} dias
                </span>
              </div>
              <button
                onClick={() => handleUseTemplate(t.id)}
                className="btn-secondary mt-4 w-full text-xs"
              >
                <Copy className="h-3.5 w-3.5" />
                Usar Plantilla
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nueva Plantilla" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Nombre de la plantilla" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Descripcion</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={2} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Categoria</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
              <option value="DEVELOPMENT">Desarrollo</option>
              <option value="DESIGN">Diseno</option>
              <option value="MARKETING">Marketing</option>
              <option value="OPERATIONS">Operaciones</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Crear</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

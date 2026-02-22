import { useEffect, useState } from "react";
import api from "../services/api";
import { FileText, Plus, Download, Eye, Clock } from "lucide-react";
import { Modal } from "../components/ui/Modal";
import { useAuthStore } from "../stores/authStore";
import { formatDate } from "../lib/utils";

interface ReportConfig {
  id: string;
  name: string;
  frequency: string;
  recipients: string[];
  createdAt: string;
}

export function Reports() {
  const { user } = useAuthStore();
  const [reports, setReports] = useState<ReportConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", frequency: "WEEKLY", recipients: "" });
  const isManager = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    api.get("/reports").then(({ data }) => setReports(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/reports", {
        ...form,
        recipients: form.recipients.split(",").map((r) => r.trim()).filter(Boolean),
      });
      setReports((prev) => [data, ...prev]);
      setShowCreate(false);
      setForm({ name: "", frequency: "WEEKLY", recipients: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async (id: string) => {
    setGenerating(id);
    try {
      await api.post(`/reports/${id}/generate`);
      alert("Reporte generado exitosamente");
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(null);
    }
  };

  const handlePreview = async (id: string) => {
    try {
      const { data } = await api.get(`/reports/${id}/preview`);
      setPreview(typeof data === "string" ? data : JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err);
    }
  };

  const freqLabel: Record<string, string> = {
    WEEKLY: "Semanal",
    MONTHLY: "Mensual",
    DAILY: "Diario",
  };

  if (loading) return <p className="py-12 text-center text-gray-500">Cargando reportes...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">Reportes</h1>
          <p className="mt-1 text-sm text-gray-500">Reportes ejecutivos automatizados</p>
        </div>
        {isManager && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus className="h-4 w-4" />
            Nuevo Reporte
          </button>
        )}
      </div>

      {reports.length === 0 ? (
        <div className="card py-16 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 font-semibold text-gray-900">Sin reportes configurados</h3>
          <p className="mt-1 text-sm text-gray-500">Configura reportes automaticos para tu equipo</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{r.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {freqLabel[r.frequency] || r.frequency}
                  </div>
                </div>
                <span className="badge bg-primary-50 text-primary-700">{freqLabel[r.frequency] || r.frequency}</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">Creado: {formatDate(r.createdAt)}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => handlePreview(r.id)} className="btn-secondary flex-1 text-xs py-2">
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => handleGenerate(r.id)}
                  disabled={generating === r.id}
                  className="btn-primary flex-1 text-xs py-2"
                >
                  <Download className="h-3.5 w-3.5" />
                  {generating === r.id ? "Generando..." : "Generar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nuevo Reporte" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Reporte semanal ejecutivo" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Frecuencia</label>
            <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="input">
              <option value="DAILY">Diario</option>
              <option value="WEEKLY">Semanal</option>
              <option value="MONTHLY">Mensual</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Destinatarios (emails separados por coma)</label>
            <input value={form.recipients} onChange={(e) => setForm({ ...form, recipients: e.target.value })} className="input" placeholder="admin@empresa.com, manager@empresa.com" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Crear Reporte</button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Preview del Reporte" size="lg">
        <pre className="max-h-[60vh] overflow-auto rounded-lg bg-gray-50 p-4 text-xs text-gray-700 whitespace-pre-wrap">
          {preview}
        </pre>
      </Modal>
    </div>
  );
}

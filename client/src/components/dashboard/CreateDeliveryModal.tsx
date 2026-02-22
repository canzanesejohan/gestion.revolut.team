import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import api from "../../services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateDeliveryModal({ open, onClose, onCreated }: Props) {
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "FEATURE",
    priority: "MEDIUM",
    projectId: "",
    assigneeId: "",
    dueDate: "",
  });

  useEffect(() => {
    if (open) {
      api.get("/projects").then(({ data }) => setProjects(data));
      api.get("/users").then(({ data }) => setUsers(data)).catch(() => {});
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/deliveries", form);
      onCreated();
      onClose();
      setForm({ title: "", description: "", type: "FEATURE", priority: "MEDIUM", projectId: "", assigneeId: "", dueDate: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";

  return (
    <Modal open={open} onClose={onClose} title="Nueva Entrega" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Titulo</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              placeholder="Nombre de la entrega"
            />
          </div>

          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Descripcion</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
              rows={2}
              placeholder="Descripcion opcional"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Proyecto</label>
            <select required value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} className={inputClass}>
              <option value="">Seleccionar...</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Asignar a</label>
            <select required value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })} className={inputClass}>
              <option value="">Seleccionar...</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tipo</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
              <option value="FEATURE">Feature</option>
              <option value="BUG_FIX">Bug Fix</option>
              <option value="DOCUMENTATION">Documentacion</option>
              <option value="DESIGN">Diseno</option>
              <option value="RESEARCH">Research</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Prioridad</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={inputClass}>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="CRITICAL">Critica</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Fecha limite</label>
            <input
              type="date"
              required
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50">
            {loading ? "Creando..." : "Crear Entrega"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

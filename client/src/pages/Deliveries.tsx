import { useEffect, useState } from "react";
import { useDeliveryStore } from "../stores/deliveryStore";
import { StatusBadge } from "../components/dashboard/StatusBadge";
import { ProgressBar } from "../components/dashboard/ProgressBar";
import { KanbanBoard } from "../components/dashboard/KanbanBoard";
import { CreateDeliveryModal } from "../components/dashboard/CreateDeliveryModal";
import { formatDate, getInitials } from "../lib/utils";
import { PRIORITY_CONFIG, type DeliveryStatus } from "../types";
import { List, Columns3, Plus } from "lucide-react";

const statusFilters: (DeliveryStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "IN_PROGRESS",
  "IN_REVIEW",
  "COMPLETED",
  "DELAYED",
  "BLOCKED",
];

type ViewMode = "table" | "kanban";

export function Deliveries() {
  const { deliveries, loading, fetchDeliveries } = useDeliveryStore();
  const [filter, setFilter] = useState<DeliveryStatus | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const params = filter !== "ALL" ? { status: filter } : undefined;
    fetchDeliveries(params);
  }, [filter, fetchDeliveries]);

  const handleCreated = () => {
    fetchDeliveries(filter !== "ALL" ? { status: filter } : undefined);
  };

  const handleKanbanChange = () => {
    fetchDeliveries(filter !== "ALL" ? { status: filter } : undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entregas</h1>
          <p className="text-sm text-gray-500">Gestiona todas las entregas del equipo</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "table" ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              Tabla
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "kanban" ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Columns3 className="h-3.5 w-3.5" />
              Kanban
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Nueva Entrega
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === s
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s === "ALL" ? "Todas" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-12 text-center text-gray-500">Cargando...</p>
      ) : viewMode === "kanban" ? (
        <KanbanBoard deliveries={deliveries} onStatusChange={handleKanbanChange} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Entrega</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Proyecto</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Asignado</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Prioridad</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Progreso</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Fecha</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deliveries.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{d.title}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{d.project.name}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs">
                        {getInitials(d.assignee.name)}
                      </div>
                      <span className="text-sm text-gray-700">{d.assignee.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium ${PRIORITY_CONFIG[d.priority].color}`}>
                      {PRIORITY_CONFIG[d.priority].label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={d.progress} size="sm" />
                      <span className="text-xs text-gray-500">{d.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{formatDate(d.dueDate)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {deliveries.length === 0 && (
            <p className="py-12 text-center text-sm text-gray-500">No hay entregas con este filtro</p>
          )}
        </div>
      )}

      <CreateDeliveryModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}

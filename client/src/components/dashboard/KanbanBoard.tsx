import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { getInitials, formatRelativeDate } from "../../lib/utils";
import { PRIORITY_CONFIG, STATUS_CONFIG, type Delivery, type DeliveryStatus } from "../../types";
import api from "../../services/api";

const COLUMNS: DeliveryStatus[] = ["PENDING", "IN_PROGRESS", "IN_REVIEW", "COMPLETED", "DELAYED", "BLOCKED"];

interface KanbanBoardProps {
  deliveries: Delivery[];
  onStatusChange?: (delivery: Delivery, newStatus: DeliveryStatus) => void;
}

export function KanbanBoard({ deliveries, onStatusChange }: KanbanBoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<DeliveryStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, column: DeliveryStatus) => {
    e.preventDefault();
    setDragOverColumn(column);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: DeliveryStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedId) return;

    const delivery = deliveries.find((d) => d.id === draggedId);
    if (!delivery || delivery.status === newStatus) return;

    try {
      await api.patch(`/deliveries/${draggedId}/status`, { status: newStatus });
      onStatusChange?.(delivery, newStatus);
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }

    setDraggedId(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((column) => {
        const columnDeliveries = deliveries.filter((d) => d.status === column);
        const config = STATUS_CONFIG[column];
        const isOver = dragOverColumn === column;

        return (
          <div
            key={column}
            className={`flex min-w-[280px] flex-1 flex-col rounded-xl border-2 transition-colors ${
              isOver ? "border-primary-400 bg-primary-50" : "border-gray-200 bg-gray-50"
            }`}
            onDragOver={(e) => handleDragOver(e, column)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column)}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${config.bg.replace("bg-", "bg-").replace("100", "500")}`} />
                <h3 className="text-sm font-semibold text-gray-700">{config.label}</h3>
              </div>
              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                {columnDeliveries.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-3">
              {columnDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, delivery.id)}
                  className={`cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md active:cursor-grabbing ${
                    draggedId === delivery.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{delivery.title}</h4>
                    <span className={`shrink-0 text-xs font-bold ${PRIORITY_CONFIG[delivery.priority].color}`}>
                      {delivery.priority === "CRITICAL" ? "!!!" : delivery.priority === "HIGH" ? "!!" : delivery.priority === "MEDIUM" ? "!" : ""}
                    </span>
                  </div>

                  {delivery.description && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{delivery.description}</p>
                  )}

                  <div className="mt-2">
                    <ProgressBar value={delivery.progress} size="sm" />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-[10px] font-medium text-primary-700">
                        {getInitials(delivery.assignee.name)}
                      </div>
                      <span className="text-xs text-gray-500">{delivery.assignee.name.split(" ")[0]}</span>
                    </div>
                    <span className={`text-xs ${
                      new Date(delivery.dueDate) < new Date() && delivery.status !== "COMPLETED"
                        ? "font-medium text-red-600"
                        : "text-gray-400"
                    }`}>
                      {formatRelativeDate(delivery.dueDate)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1">
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                      {delivery.type.replace("_", " ")}
                    </span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                      {delivery.project.name}
                    </span>
                  </div>
                </div>
              ))}

              {columnDeliveries.length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-8">
                  <p className="text-xs text-gray-400">Arrastra entregas aqui</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

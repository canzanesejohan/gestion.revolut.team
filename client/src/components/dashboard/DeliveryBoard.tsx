import { StatusBadge } from "./StatusBadge";
import { formatRelativeDate, getInitials } from "../../lib/utils";
import { PRIORITY_CONFIG, type Delivery } from "../../types";

interface DeliveryBoardProps {
  deliveries: Delivery[];
}

export function DeliveryBoard({ deliveries }: DeliveryBoardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="font-semibold text-gray-900">Entregas Recientes</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {deliveries.slice(0, 10).map((delivery) => (
          <div key={delivery.id} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                {getInitials(delivery.assignee.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{delivery.title}</p>
                <p className="text-xs text-gray-500">
                  {delivery.project.name} · {formatRelativeDate(delivery.dueDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${PRIORITY_CONFIG[delivery.priority].color}`}>
                {PRIORITY_CONFIG[delivery.priority].label}
              </span>
              <StatusBadge status={delivery.status} />
            </div>
          </div>
        ))}
        {deliveries.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-gray-500">No hay entregas</p>
        )}
      </div>
    </div>
  );
}

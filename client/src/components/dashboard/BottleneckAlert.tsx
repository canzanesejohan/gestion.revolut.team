import { AlertTriangle } from "lucide-react";
import type { Delivery } from "../../types";

interface BottleneckAlertProps {
  deliveries: Delivery[];
}

export function BottleneckAlert({ deliveries }: BottleneckAlertProps) {
  const delayed = deliveries.filter((d) => d.status === "DELAYED");
  const blocked = deliveries.filter((d) => d.status === "BLOCKED");

  if (delayed.length === 0 && blocked.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <p className="text-sm font-medium text-green-700">Sin cuellos de botella detectados</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Cuellos de Botella
        </h2>
      </div>
      <div className="divide-y divide-gray-100">
        {delayed.map((d) => (
          <div key={d.id} className="flex items-center gap-3 px-5 py-3">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{d.title}</p>
              <p className="text-xs text-red-600">Retrasada - {d.project.name}</p>
            </div>
          </div>
        ))}
        {blocked.map((d) => (
          <div key={d.id} className="flex items-center gap-3 px-5 py-3">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{d.title}</p>
              <p className="text-xs text-orange-600">Bloqueada - {d.project.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

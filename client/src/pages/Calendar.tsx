import { useEffect, useState } from "react";
import api from "../services/api";
import { formatDate } from "../lib/utils";
import { StatusBadge } from "../components/dashboard/StatusBadge";
import type { Delivery } from "../types";

export function CalendarPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    api.get("/deliveries").then(({ data }) => setDeliveries(data));
  }, []);

  // Group deliveries by due date
  const grouped = deliveries.reduce<Record<string, Delivery[]>>((acc, d) => {
    const date = d.dueDate.split("T")[0]!;
    if (!acc[date]) acc[date] = [];
    acc[date]!.push(d);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
        <p className="text-sm text-gray-500">Vista de entregas por fecha</p>
      </div>
      <div className="space-y-4">
        {sortedDates.map((date) => (
          <div key={date} className="rounded-xl border bg-white p-4">
            <h3 className="mb-3 font-semibold text-gray-900">{formatDate(date)}</h3>
            <div className="space-y-2">
              {grouped[date]!.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-gray-500">{d.project.name} - {d.assignee.name}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          </div>
        ))}
        {sortedDates.length === 0 && (
          <p className="py-12 text-center text-gray-500">No hay entregas programadas</p>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../services/api";
import { formatDate, getInitials } from "../lib/utils";
import { StatusBadge } from "../components/dashboard/StatusBadge";
import type { Delivery } from "../types";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const monthStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
  const monthDates = Object.keys(grouped).filter((date) => date.startsWith(monthStr)).sort();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const monthLabel = currentMonth.toLocaleDateString("es", { month: "long", year: "numeric" });

  // Calendar grid
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startPad = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const calendarDays: (number | null)[] = [
    ...Array(startPad).fill(null) as null[],
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">Calendario</h1>
          <p className="mt-1 text-sm text-gray-500">Vista de entregas por fecha</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[160px] text-center text-sm font-semibold capitalize text-gray-900">{monthLabel}</span>
          <button onClick={nextMonth} className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100">
          {["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].map((d) => (
            <div key={d} className="px-2 py-3 text-center text-xs font-medium uppercase text-gray-400">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`pad-${i}`} className="border-b border-r border-gray-50 bg-gray-50/50 p-2 min-h-[80px] sm:min-h-[100px]" />;

            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayDeliveries = grouped[dateStr] || [];
            const isToday = dateStr === todayStr;

            return (
              <div key={dateStr} className={`border-b border-r border-gray-50 p-1.5 sm:p-2 min-h-[80px] sm:min-h-[100px] ${isToday ? "bg-primary-50/50" : ""}`}>
                <div className={`mb-1 text-xs font-medium ${isToday ? "flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white" : "text-gray-500"}`}>
                  {day}
                </div>
                <div className="space-y-0.5">
                  {dayDeliveries.slice(0, 3).map((d) => (
                    <div key={d.id} className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${
                      d.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                      d.status === "DELAYED" ? "bg-red-100 text-red-700" :
                      d.status === "BLOCKED" ? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {d.title}
                    </div>
                  ))}
                  {dayDeliveries.length > 3 && (
                    <p className="text-[10px] text-gray-400 pl-1">+{dayDeliveries.length - 3} mas</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline View */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Entregas del Mes</h2>
        <div className="space-y-3">
          {monthDates.length > 0 ? (
            monthDates.map((date) => (
              <div key={date} className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">{formatDate(date)}</h3>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{grouped[date]!.length}</span>
                </div>
                <div className="space-y-2">
                  {grouped[date]!.map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-medium text-primary-700">
                          {getInitials(d.assignee.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{d.title}</p>
                          <p className="text-xs text-gray-500">{d.project.name} - {d.assignee.name}</p>
                        </div>
                      </div>
                      <StatusBadge status={d.status} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="card py-12 text-center">
              <CalendarIcon className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No hay entregas programadas este mes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

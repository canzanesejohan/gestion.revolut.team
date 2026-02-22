import { Package, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import type { DeliveryStats } from "../../types";

interface KpiCardsProps {
  stats: DeliveryStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const cards = [
    {
      label: "Total Entregas",
      value: stats.total,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "En Curso",
      value: stats.inProgress + stats.inReview,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Retrasadas",
      value: stats.delayed + stats.overdue,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Completadas",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`rounded-lg ${card.bg} p-3`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

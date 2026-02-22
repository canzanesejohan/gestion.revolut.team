import { Package, Clock, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import type { DeliveryStats } from "../../types";

interface KpiCardsProps {
  stats: DeliveryStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const cards = [
    {
      label: "Total Entregas",
      value: stats.total,
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "En Curso",
      value: stats.inProgress + stats.inReview,
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      label: "Retrasadas",
      value: stats.delayed + stats.overdue,
      icon: AlertTriangle,
      gradient: "from-rose-500 to-red-500",
    },
    {
      label: "Completadas",
      value: stats.completed,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-green-500",
      extra: `${completionRate}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="card p-4 sm:p-5 hover:shadow-elevated transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{card.label}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{card.value}</p>
                {card.extra && (
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    {card.extra}
                  </span>
                )}
              </div>
            </div>
            <div className={`rounded-xl bg-gradient-to-br ${card.gradient} p-2.5 shadow-lg shadow-black/10`}>
              <card.icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

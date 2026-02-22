import { useEffect, useState } from "react";
import { StatusPieChart, VelocityChart, TeamPerformanceChart } from "../components/dashboard/TimelineChart";
import api from "../services/api";
import type { DeliveryStats } from "../types";
import { TrendingUp, TrendingDown, Target, Clock, AlertTriangle, Lightbulb } from "lucide-react";

interface Compliance {
  total: number;
  onTime: number;
  late: number;
  rate: number;
}

interface AvgTime {
  type: string;
  avgDays: number;
}

interface Insight {
  type: "success" | "warning" | "info";
  message: string;
}

export function Analytics() {
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [velocity, setVelocity] = useState<{ week: string; completed: number }[]>([]);
  const [teamStats, setTeamStats] = useState<{ name: string; completed: number; active: number }[]>([]);
  const [compliance, setCompliance] = useState<Compliance | null>(null);
  const [avgTime, setAvgTime] = useState<AvgTime[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/deliveries/stats"),
      api.get("/analytics/velocity"),
      api.get("/analytics/team"),
      api.get("/analytics/compliance"),
      api.get("/analytics/avg-time"),
      api.get("/analytics/insights"),
    ]).then(([statsRes, velRes, teamRes, compRes, avgRes, insRes]) => {
      setStats(statsRes.data);
      setVelocity(velRes.data);
      setTeamStats(teamRes.data);
      setCompliance(compRes.data);
      setAvgTime(avgRes.data);
      setInsights(insRes.data);
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="py-12 text-center text-gray-500">Cargando metricas...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500">Metricas de productividad del equipo</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Tasa de Cumplimiento</p>
            <Target className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{compliance ? `${compliance.rate}%` : "N/A"}</p>
          <p className="mt-1 text-xs text-gray-400">
            {compliance ? `${compliance.onTime} a tiempo de ${compliance.total}` : ""}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Entregas Completadas</p>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.completed ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">de {stats?.total ?? 0} totales</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Retrasadas</p>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-red-600">{stats?.delayed ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">{stats?.blocked ?? 0} bloqueadas</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Tiempo Promedio</p>
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {avgTime.length > 0
              ? `${Math.round(avgTime.reduce((a, b) => a + b.avgDays, 0) / avgTime.length)}d`
              : "N/A"}
          </p>
          <p className="mt-1 text-xs text-gray-400">promedio por entrega</p>
        </div>
      </div>

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <StatusPieChart stats={stats} />
          <VelocityChart data={velocity} />
          <TeamPerformanceChart data={teamStats} />
        </div>
      )}

      {/* Avg Time by Type */}
      {avgTime.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-gray-900">Tiempo Promedio por Tipo de Entrega</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {avgTime.map((item) => (
              <div key={item.type} className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-xs font-medium text-gray-500">{item.type.replace("_", " ")}</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{item.avgDays}d</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900">Insights Automaticos</h3>
          </div>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-lg p-3 ${
                  insight.type === "success"
                    ? "bg-green-50"
                    : insight.type === "warning"
                    ? "bg-yellow-50"
                    : "bg-blue-50"
                }`}
              >
                {insight.type === "warning" ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
                ) : insight.type === "success" ? (
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                ) : (
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                )}
                <p className={`text-sm ${
                  insight.type === "success"
                    ? "text-green-800"
                    : insight.type === "warning"
                    ? "text-yellow-800"
                    : "text-blue-800"
                }`}>
                  {insight.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

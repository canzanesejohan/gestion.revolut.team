import { useEffect, useState } from "react";
import { useDeliveryStore } from "../stores/deliveryStore";
import { KpiCards } from "../components/dashboard/KpiCards";
import { ProjectCard } from "../components/dashboard/ProjectCard";
import { DeliveryBoard } from "../components/dashboard/DeliveryBoard";
import { BottleneckAlert } from "../components/dashboard/BottleneckAlert";
import { StatusPieChart, VelocityChart, TeamPerformanceChart } from "../components/dashboard/TimelineChart";
import { KanbanBoard } from "../components/dashboard/KanbanBoard";
import api from "../services/api";
import type { Project } from "../types";
import { LayoutGrid, Columns3 } from "lucide-react";

type ViewMode = "overview" | "kanban";

export function Dashboard() {
  const { deliveries, stats, fetchDeliveries, fetchStats } = useDeliveryStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [velocity, setVelocity] = useState<{ week: string; completed: number }[]>([]);
  const [teamStats, setTeamStats] = useState<{ name: string; completed: number; active: number }[]>([]);

  useEffect(() => {
    fetchDeliveries();
    fetchStats();
    api.get("/projects").then(({ data }) => setProjects(data));
    api.get("/analytics/velocity").then(({ data }) => setVelocity(data)).catch(() => {});
    api.get("/analytics/team").then(({ data }) => setTeamStats(data)).catch(() => {});
  }, [fetchDeliveries, fetchStats]);

  const handleKanbanStatusChange = () => {
    fetchDeliveries();
    fetchStats();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Vista general de todos los proyectos y entregas</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => setViewMode("overview")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === "overview" ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            General
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === "kanban" ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Columns3 className="h-4 w-4" />
            Kanban
          </button>
        </div>
      </div>

      {stats && <KpiCards stats={stats} />}

      {viewMode === "kanban" ? (
        <KanbanBoard deliveries={deliveries} onStatusChange={handleKanbanStatusChange} />
      ) : (
        <>
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Proyectos Activos</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((p) => p.status === "ACTIVE")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </div>

          {/* Charts Row */}
          {stats && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <StatusPieChart stats={stats} />
              <VelocityChart data={velocity} />
              <TeamPerformanceChart data={teamStats} />
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DeliveryBoard deliveries={deliveries} />
            </div>
            <div>
              <BottleneckAlert deliveries={deliveries} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useDeliveryStore } from "../stores/deliveryStore";
import { KpiCards } from "../components/dashboard/KpiCards";
import { ProjectCard } from "../components/dashboard/ProjectCard";
import { DeliveryBoard } from "../components/dashboard/DeliveryBoard";
import { BottleneckAlert } from "../components/dashboard/BottleneckAlert";
import api from "../services/api";
import type { Project } from "../types";

export function Dashboard() {
  const { deliveries, stats, fetchDeliveries, fetchStats } = useDeliveryStore();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchDeliveries();
    fetchStats();
    api.get("/projects").then(({ data }) => setProjects(data));
  }, [fetchDeliveries, fetchStats]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Vista general de todos los proyectos y entregas</p>
      </div>

      {stats && <KpiCards stats={stats} />}

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DeliveryBoard deliveries={deliveries} />
        </div>
        <div>
          <BottleneckAlert deliveries={deliveries} />
        </div>
      </div>
    </div>
  );
}

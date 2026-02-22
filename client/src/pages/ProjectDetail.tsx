import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { StatusBadge } from "../components/dashboard/StatusBadge";
import { ProgressBar } from "../components/dashboard/ProgressBar";
import { formatDate, getInitials } from "../lib/utils";
import type { Delivery, Milestone } from "../types";

interface ProjectDetailData {
  id: string;
  name: string;
  description?: string;
  status: string;
  startDate: string;
  endDate: string;
  manager: { id: string; name: string; avatarUrl?: string };
  deliveries: Delivery[];
  milestones: Milestone[];
}

export function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectDetailData | null>(null);

  useEffect(() => {
    if (id) {
      api.get(`/projects/${id}`).then(({ data }) => setProject(data));
    }
  }, [id]);

  if (!project) {
    return <p className="py-12 text-center text-gray-500">Cargando proyecto...</p>;
  }

  const completedCount = project.deliveries.filter((d) => d.status === "COMPLETED").length;
  const progress = project.deliveries.length > 0
    ? Math.round((completedCount / project.deliveries.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        <p className="text-sm text-gray-500">{project.description}</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Manager</p>
          <p className="font-medium">{project.manager.name}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Periodo</p>
          <p className="font-medium">{formatDate(project.startDate)} - {formatDate(project.endDate)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Entregas</p>
          <p className="font-medium">{completedCount}/{project.deliveries.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Progreso</p>
          <div className="mt-1"><ProgressBar value={progress} /></div>
        </div>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold">Entregas</h2>
        </div>
        <div className="divide-y">
          {project.deliveries.map((d) => (
            <div key={d.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs">
                  {getInitials(d.assignee.name)}
                </div>
                <div>
                  <p className="text-sm font-medium">{d.title}</p>
                  <p className="text-xs text-gray-500">{d.assignee.name} · {formatDate(d.dueDate)}</p>
                </div>
              </div>
              <StatusBadge status={d.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

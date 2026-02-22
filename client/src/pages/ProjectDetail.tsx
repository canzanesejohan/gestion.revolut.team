import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { StatusBadge } from "../components/dashboard/StatusBadge";
import { ProgressBar } from "../components/dashboard/ProgressBar";
import { KanbanBoard } from "../components/dashboard/KanbanBoard";
import { formatDate, getInitials } from "../lib/utils";
import type { Delivery, Milestone } from "../types";
import { Calendar, Users, Target, Clock, ListTodo, Columns3, Flag } from "lucide-react";

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

type Tab = "deliveries" | "kanban" | "milestones";

export function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("deliveries");

  const fetchProject = () => {
    if (id) {
      api.get(`/projects/${id}`).then(({ data }) => setProject(data));
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (!project) {
    return <p className="py-12 text-center text-gray-500">Cargando proyecto...</p>;
  }

  const completedCount = project.deliveries.filter((d) => d.status === "COMPLETED").length;
  const progress = project.deliveries.length > 0
    ? Math.round((completedCount / project.deliveries.length) * 100)
    : 0;

  const daysLeft = Math.max(0, Math.ceil((new Date(project.endDate).getTime() - Date.now()) / 86400000));
  const totalDays = Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / 86400000);
  const timeProgress = totalDays > 0 ? Math.min(100, Math.round(((totalDays - daysLeft) / totalDays) * 100)) : 0;

  const tabs: { key: Tab; label: string; icon: typeof ListTodo }[] = [
    { key: "deliveries", label: "Entregas", icon: ListTodo },
    { key: "kanban", label: "Kanban", icon: Columns3 },
    { key: "milestones", label: "Hitos", icon: Flag },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                project.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                project.status === "ON_HOLD" ? "bg-yellow-100 text-yellow-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {project.status}
              </span>
            </div>
            {project.description && (
              <p className="mt-2 text-sm text-gray-500">{project.description}</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <Users className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Manager</p>
              <p className="text-sm font-medium">{project.manager.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Periodo</p>
              <p className="text-sm font-medium">{formatDate(project.startDate)} - {formatDate(project.endDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <Target className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Entregas</p>
              <p className="text-sm font-medium">{completedCount}/{project.deliveries.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Dias restantes</p>
              <p className="text-sm font-medium">{daysLeft} dias</p>
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">Progreso</p>
              <span className="text-xs font-bold text-primary-600">{progress}%</span>
            </div>
            <div className="mt-2"><ProgressBar value={progress} /></div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-[10px] text-gray-400">Tiempo: {timeProgress}%</p>
              <p className={`text-[10px] font-medium ${progress >= timeProgress ? "text-green-600" : "text-red-600"}`}>
                {progress >= timeProgress ? "Al dia" : "Atrasado"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                  {tab.key === "milestones" ? project.milestones.length : project.deliveries.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "deliveries" && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="divide-y">
            {project.deliveries.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                    {getInitials(d.assignee.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{d.title}</p>
                    <p className="text-xs text-gray-500">{d.assignee.name} · {formatDate(d.dueDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24">
                    <ProgressBar value={d.progress} size="sm" />
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              </div>
            ))}
            {project.deliveries.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">No hay entregas en este proyecto</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "kanban" && (
        <KanbanBoard deliveries={project.deliveries} onStatusChange={fetchProject} />
      )}

      {activeTab === "milestones" && (
        <div className="space-y-4">
          {project.milestones.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200" />

              {project.milestones
                .sort((a, b) => a.order - b.order)
                .map((milestone) => {
                  const milestoneDeliveries = project.deliveries.filter((d) => d.milestoneId === milestone.id);
                  const milestoneCompleted = milestoneDeliveries.filter((d) => d.status === "COMPLETED").length;
                  const milestoneProgress = milestoneDeliveries.length > 0
                    ? Math.round((milestoneCompleted / milestoneDeliveries.length) * 100)
                    : 0;

                  return (
                    <div key={milestone.id} className="relative mb-6 ml-12">
                      {/* Timeline dot */}
                      <div className={`absolute -left-[38px] top-2 h-4 w-4 rounded-full border-2 border-white ${
                        milestone.status === "COMPLETED" ? "bg-green-500" :
                        milestone.status === "IN_PROGRESS" ? "bg-blue-500" :
                        milestone.status === "DELAYED" ? "bg-red-500" :
                        "bg-gray-300"
                      }`} />

                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{milestone.name}</h3>
                            {milestone.description && (
                              <p className="mt-1 text-sm text-gray-500">{milestone.description}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">
                              Fecha limite: {formatDate(milestone.dueDate)}
                            </p>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            milestone.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                            milestone.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                            milestone.status === "DELAYED" ? "bg-red-100 text-red-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {milestone.status}
                          </span>
                        </div>

                        {milestoneDeliveries.length > 0 && (
                          <div className="mt-3 border-t border-gray-100 pt-3">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{milestoneCompleted}/{milestoneDeliveries.length} entregas</span>
                              <span>{milestoneProgress}%</span>
                            </div>
                            <div className="mt-1">
                              <ProgressBar value={milestoneProgress} size="sm" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
              <Flag className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No hay hitos definidos</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

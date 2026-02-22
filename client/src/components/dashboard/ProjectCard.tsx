import { Link } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { getInitials } from "../../lib/utils";
import type { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{project.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{project.description}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
          {getInitials(project.manager.name)}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Progreso</span>
          <span className="font-medium text-gray-900">{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} size="sm" />
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span>{project._count.deliveries} entregas</span>
        <span>{project._count.milestones} hitos</span>
      </div>
    </Link>
  );
}

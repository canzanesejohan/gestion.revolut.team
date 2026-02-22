import { Link } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { getInitials } from "../../lib/utils";
import type { Project } from "../../types";
import { FolderOpen, Milestone } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="card-hover block p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
          {project.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
          )}
        </div>
        <div className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-500 text-xs font-bold text-white shadow-sm">
          {getInitials(project.manager.name)}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Progreso</span>
          <span className="font-bold text-gray-900">{project.progress}%</span>
        </div>
        <div className="mt-1.5">
          <ProgressBar value={project.progress} size="sm" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <FolderOpen className="h-3 w-3" />
          {project._count.deliveries} entregas
        </span>
        <span className="flex items-center gap-1">
          <Milestone className="h-3 w-3" />
          {project._count.milestones} hitos
        </span>
      </div>
    </Link>
  );
}

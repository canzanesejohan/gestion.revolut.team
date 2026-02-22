// ─── Enums ───────────────────────────────────────────────

export type UserRole = "ADMIN" | "MANAGER" | "MEMBER";
export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED" | "ON_HOLD";
export type DeliveryStatus = "PENDING" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED" | "DELAYED" | "BLOCKED";
export type DeliveryType = "FEATURE" | "BUG_FIX" | "DOCUMENTATION" | "DESIGN" | "RESEARCH" | "OTHER";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type NotificationType = "STATUS_CHANGE" | "DEADLINE_WARNING" | "BLOCKER_ALERT" | "CHECKIN_REMINDER" | "REPORT_READY" | "WORKLOAD_ALERT" | "BOTTLENECK";

// ─── Models ──────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  telegramChatId?: string;
  isActive: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  managerId: string;
  manager: Pick<User, "id" | "name" | "avatarUrl">;
  progress: number;
  _count: { deliveries: number; milestones: number };
}

export interface Delivery {
  id: string;
  title: string;
  description?: string;
  status: DeliveryStatus;
  type: DeliveryType;
  priority: Priority;
  progress: number;
  projectId: string;
  assigneeId: string;
  milestoneId?: string;
  dueDate: string;
  completedAt?: string;
  project: Pick<Project, "id" | "name">;
  assignee: Pick<User, "id" | "name" | "avatarUrl">;
  milestone?: { id: string; name: string };
}

export interface DeliveryLog {
  id: string;
  deliveryId: string;
  previousStatus: DeliveryStatus;
  newStatus: DeliveryStatus;
  changedBy: Pick<User, "id" | "name">;
  note?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  channel: "IN_APP" | "TELEGRAM";
  read: boolean;
  deliveryId?: string;
  createdAt: string;
}

export interface Checkin {
  id: string;
  userId: string;
  projectId: string;
  date: string;
  accomplished: string;
  planned: string;
  mood: number;
  user: Pick<User, "id" | "name" | "avatarUrl">;
  project: Pick<Project, "id" | "name">;
  blockers: CheckinBlocker[];
}

export interface CheckinBlocker {
  id: string;
  description: string;
  isResolved: boolean;
  resolvedAt?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  dueDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DELAYED";
  order: number;
}

export interface DeliveryStats {
  total: number;
  pending: number;
  inProgress: number;
  inReview: number;
  completed: number;
  delayed: number;
  blocked: number;
  overdue: number;
}

// ─── Auth ────────────────────────────────────────────────

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ─── Status Config ───────────────────────────────────────

export const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pendiente", color: "text-gray-600", bg: "bg-gray-100" },
  IN_PROGRESS: { label: "En curso", color: "text-blue-600", bg: "bg-blue-100" },
  IN_REVIEW: { label: "En revisión", color: "text-yellow-600", bg: "bg-yellow-100" },
  COMPLETED: { label: "Completado", color: "text-green-600", bg: "bg-green-100" },
  DELAYED: { label: "Retrasado", color: "text-red-600", bg: "bg-red-100" },
  BLOCKED: { label: "Bloqueado", color: "text-orange-600", bg: "bg-orange-100" },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  LOW: { label: "Baja", color: "text-gray-500" },
  MEDIUM: { label: "Media", color: "text-blue-500" },
  HIGH: { label: "Alta", color: "text-orange-500" },
  CRITICAL: { label: "Crítica", color: "text-red-500" },
};

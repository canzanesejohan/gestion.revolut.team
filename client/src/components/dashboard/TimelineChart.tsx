import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import type { DeliveryStats } from "../../types";

const COLORS = {
  PENDING: "#9ca3af",
  IN_PROGRESS: "#3b82f6",
  IN_REVIEW: "#eab308",
  COMPLETED: "#22c55e",
  DELAYED: "#ef4444",
  BLOCKED: "#f97316",
};

interface StatusChartProps {
  stats: DeliveryStats;
}

export function StatusPieChart({ stats }: StatusChartProps) {
  const data = [
    { name: "Pendientes", value: stats.pending, color: COLORS.PENDING },
    { name: "En curso", value: stats.inProgress, color: COLORS.IN_PROGRESS },
    { name: "En revision", value: stats.inReview, color: COLORS.IN_REVIEW },
    { name: "Completadas", value: stats.completed, color: COLORS.COMPLETED },
    { name: "Retrasadas", value: stats.delayed, color: COLORS.DELAYED },
    { name: "Bloqueadas", value: stats.blocked, color: COLORS.BLOCKED },
  ].filter((d) => d.value > 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 font-semibold text-gray-900">Distribucion por Estado</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface VelocityChartProps {
  data: { week: string; completed: number }[];
}

export function VelocityChart({ data }: VelocityChartProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 font-semibold text-gray-900">Velocidad de Entrega</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => new Date(v).toLocaleDateString("es", { day: "2-digit", month: "short" })}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            labelFormatter={(v) => new Date(v as string).toLocaleDateString("es", { day: "2-digit", month: "long" })}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#3b82f6" }}
            name="Completadas"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TeamChartProps {
  data: { name: string; completed: number; active: number }[];
}

export function TeamPerformanceChart({ data }: TeamChartProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 font-semibold text-gray-900">Rendimiento del Equipo</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#22c55e" name="Completadas" radius={[0, 4, 4, 0]} />
          <Bar dataKey="active" fill="#3b82f6" name="Activas" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

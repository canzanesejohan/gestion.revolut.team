import { cn } from "../../lib/utils";

interface ProgressBarProps {
  value: number;
  size?: "sm" | "md";
}

export function ProgressBar({ value, size = "md" }: ProgressBarProps) {
  const color =
    value >= 100
      ? "bg-green-500"
      : value >= 60
        ? "bg-blue-500"
        : value >= 30
          ? "bg-yellow-500"
          : "bg-red-500";

  return (
    <div className={cn("w-full rounded-full bg-gray-200", size === "sm" ? "h-1.5" : "h-2.5")}>
      <div
        className={cn("rounded-full transition-all", color, size === "sm" ? "h-1.5" : "h-2.5")}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

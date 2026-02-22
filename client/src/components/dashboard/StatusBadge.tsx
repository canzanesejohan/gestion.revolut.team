import { cn } from "../../lib/utils";
import { STATUS_CONFIG, type DeliveryStatus } from "../../types";

interface StatusBadgeProps {
  status: DeliveryStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.color
      )}
    >
      {config.label}
    </span>
  );
}

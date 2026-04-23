import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, type OrderStatus, type StatusTone } from "@/lib/domain/order-status";
import { cn } from "@/lib/utils";

const TONE_CLASSES: Record<StatusTone, string> = {
  draft: "bg-status-draft text-status-draft-foreground",
  pending: "bg-status-pending text-status-pending-foreground",
  approved: "bg-status-approved text-status-approved-foreground",
  production: "bg-status-production text-status-production-foreground",
  delivered: "bg-status-delivered text-status-delivered-foreground",
  rejected: "bg-status-rejected text-status-rejected-foreground",
};

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const tone = ORDER_STATUS_TONE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        TONE_CLASSES[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

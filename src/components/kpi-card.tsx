import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: string; positive?: boolean };
  hint?: string;
  tone?: "default" | "primary" | "accent" | "success" | "warning";
  className?: string;
}

const TONE: Record<NonNullable<KPICardProps["tone"]>, string> = {
  default: "text-foreground",
  primary: "text-primary",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning-foreground",
};

export function KPICard({ label, value, icon: Icon, trend, hint, tone = "default", className }: KPICardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        {Icon && (
          <div className="rounded-lg bg-primary-soft p-2 text-primary">
            <Icon className="size-4" />
          </div>
        )}
      </div>
      <div className={cn("mt-3 text-3xl font-bold tabular-nums", TONE[tone])}>{value}</div>
      {(trend || hint) && (
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          {trend && (
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 font-medium",
                trend.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {trend.positive ? "▲" : "▼"} {trend.value}
            </span>
          )}
          {hint && <span>{hint}</span>}
        </div>
      )}
    </div>
  );
}

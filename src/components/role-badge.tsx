import { ROLE_LABEL, type AppRole } from "@/lib/domain/roles";
import { cn } from "@/lib/utils";

const ROLE_CLASSES: Record<AppRole, string> = {
  solicitante: "bg-secondary text-secondary-foreground",
  coordenador: "bg-info/15 text-info",
  fornecedor: "bg-warning/15 text-warning-foreground",
  admin_fornecedor: "bg-warning/20 text-warning-foreground",
  admin_orgao: "bg-primary-soft text-primary",
  master: "bg-accent/15 text-accent",
};

export function RoleBadge({ role, className }: { role: AppRole; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        ROLE_CLASSES[role],
        className,
      )}
    >
      {ROLE_LABEL[role]}
    </span>
  );
}

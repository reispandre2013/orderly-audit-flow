import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, Wheat } from "lucide-react";
import { filterNavGroupsByRole } from "@/lib/nav-config";
import { useAuth } from "@/lib/auth/auth-context";
import { ROLE_LABEL } from "@/lib/domain/roles";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { activeRole, user, setActiveRole } = useAuth();
  const location = useLocation();
  const groups = filterNavGroupsByRole(activeRole);

  const isActive = (to: string) =>
    to === "/app" ? location.pathname === "/app" : location.pathname.startsWith(to);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Wheat className="size-5" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-sidebar-foreground">SisPão Público</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Gestão de abastecimento</div>
        </div>
      </div>

      {user && user.roles.length > 1 && (
        <div className="border-b border-sidebar-border px-3 py-3">
          <label className="mb-1 block px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Perfil ativo
          </label>
          <div className="relative">
            <select
              value={activeRole ?? ""}
              onChange={(e) => setActiveRole(e.target.value as never)}
              className="w-full appearance-none rounded-md border border-sidebar-border bg-background py-2 pl-3 pr-8 text-sm font-medium text-sidebar-foreground"
            >
              {user.roles.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.length === 0 && (
          <div className="px-3 py-6 text-xs text-muted-foreground">
            Nenhum módulo disponível para este perfil.
          </div>
        )}
        {groups.map((group) => (
          <div key={group.title} className="mb-5">
            <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                      <span className="flex-1 truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-3 text-[10px] text-muted-foreground">
        v0.1 · Fase 1 — Fundação visual
      </div>
    </aside>
  );
}

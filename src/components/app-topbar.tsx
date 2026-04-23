import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Search, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { RoleBadge } from "@/components/role-badge";

export function AppTopbar() {
  const { user, activeRole, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const initials =
    user?.full_name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() ?? "??";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-surface/90 px-4 backdrop-blur-sm md:px-6">
      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar por ordem, fornecedor, CPF, matrícula…"
          className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/app/notificacoes"
          className="relative flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Notificações"
        >
          <Bell className="size-4" />
        </Link>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 rounded-md border border-border bg-background px-2 py-1.5 text-left transition-colors hover:bg-secondary"
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              {initials}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold leading-tight text-foreground">
                {user?.full_name ?? "Visitante"}
              </div>
              <div className="text-[11px] leading-tight text-muted-foreground">
                {user?.matricula ? `Matrícula ${user.matricula}` : "Sem sessão"}
              </div>
            </div>
            {activeRole && <RoleBadge role={activeRole} className="hidden lg:inline-flex" />}
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-floating"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <Link
                to="/app/perfil"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary"
              >
                <User className="size-4" /> Meu perfil
              </Link>
              <button
                onClick={async () => {
                  setMenuOpen(false);
                  await signOut();
                  navigate({ to: "/login" });
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-4" /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

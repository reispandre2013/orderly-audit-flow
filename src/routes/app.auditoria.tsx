import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Search, Download, Activity } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/app/auditoria")({
  head: () => ({ meta: [{ title: "Auditoria — SisPão Público" }] }),
  component: AuditoriaPage,
});

const ACTIONS = [
  "all",
  "auth.login",
  "auth.logout",
  "order.created",
  "order.submitted",
  "order.approved",
  "order.rejected",
  "order.signed",
  "order.sent_to_supplier",
  "order.accepted_by_supplier",
  "order.in_production",
  "order.ready",
  "order.delivered",
  "order.cancelled",
  "user.created",
  "user.role_changed",
  "tenant.updated",
  "attachment.uploaded",
] as const;

const ENTITIES = ["all", "order", "user", "tenant", "attachment", "session"] as const;

function AuditoriaPage() {
  const [query, setQuery] = useState("");
  const [action, setAction] = useState<(typeof ACTIONS)[number]>("all");
  const [entity, setEntity] = useState<(typeof ENTITIES)[number]>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div>
      <PageHeader
        breadcrumb="Administrativo / Auditoria"
        title="Trilha de auditoria"
        description="Cada ação crítica é registrada com ator (CPF + matrícula), IP, navegador, sistema e diff completo."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary">
            <Download className="size-4" /> Exportar trilha
          </button>
        }
      />

      <div className="mb-4 rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="relative md:col-span-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ator, CPF, IP, ID da entidade…"
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as typeof action)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm md:col-span-3"
          >
            <option value="all">Todas as ações</option>
            {ACTIONS.filter((a) => a !== "all").map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select
            value={entity}
            onChange={(e) => setEntity(e.target.value as typeof entity)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm md:col-span-2"
          >
            <option value="all">Todas as entidades</option>
            {ENTITIES.filter((e) => e !== "all").map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm md:col-span-1.5"
            aria-label="De"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm md:col-span-1.5"
            aria-label="Até"
          />
        </div>
      </div>

      <SectionCard title="Eventos" description="0 eventos no filtro atual">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Quando</th>
                <th className="px-3 py-2">Ação</th>
                <th className="px-3 py-2">Entidade</th>
                <th className="px-3 py-2">Ator</th>
                <th className="px-3 py-2">CPF / Mat.</th>
                <th className="px-3 py-2">IP</th>
                <th className="px-3 py-2">Dispositivo</th>
                <th className="px-3 py-2 text-right">Diff</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="bg-card p-0">
                  <EmptyState
                    icon={ShieldCheck}
                    title="Trilha vazia"
                    description="Quando o backend estiver conectado, eventos auditados aparecerão aqui em tempo real, com diff JSON completo e exportação assinada."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoTile
          icon={Activity}
          title="Retenção"
          description="Eventos retidos por tempo indeterminado. Configurável por master."
        />
        <InfoTile
          icon={ShieldCheck}
          title="Imutabilidade"
          description="Linhas de auditoria são append-only. RLS impede UPDATE/DELETE até para masters."
        />
        <InfoTile
          icon={Download}
          title="Exportação"
          description="CSV e JSON assinados (hash SHA-256) para anexar a processos administrativos."
        />
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="mb-2 inline-flex rounded-lg bg-primary-soft p-2 text-primary">
        <Icon className="size-4" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

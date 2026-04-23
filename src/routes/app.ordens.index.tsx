import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ClipboardList, Plus, Search, Filter, Download } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/domain/order-status";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/ordens/")({
  head: () => ({ meta: [{ title: "Ordens de compra — SisPão Público" }] }),
  component: OrdensPage,
});

interface Filters {
  query: string;
  status: OrderStatus | "all";
  periodo: "7d" | "30d" | "90d" | "all";
  fornecedor: string;
  orgao: string;
}

const INITIAL: Filters = {
  query: "",
  status: "all",
  periodo: "30d",
  fornecedor: "",
  orgao: "",
};

function OrdensPage() {
  const [filters, setFilters] = useState<Filters>(INITIAL);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (p: Partial<Filters>) => setFilters((f) => ({ ...f, ...p }));
  const reset = () => setFilters(INITIAL);
  const hasActive =
    filters.query !== "" ||
    filters.status !== "all" ||
    filters.fornecedor !== "" ||
    filters.orgao !== "" ||
    filters.periodo !== "30d";

  return (
    <div>
      <PageHeader
        breadcrumb="Operação / Ordens"
        title="Ordens de compra"
        description="Liste, filtre e acompanhe todas as ordens com rastreabilidade completa."
        actions={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              <Download className="size-4" /> Exportar
            </button>
            <Link
              to="/app/ordens/nova"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:shadow-elevated"
            >
              <Plus className="size-4" /> Nova ordem
            </Link>
          </>
        }
      />

      {/* Toolbar */}
      <div className="mb-4 rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => update({ query: e.target.value })}
              placeholder="Buscar por número, solicitante, fornecedor…"
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => update({ status: e.target.value as Filters["status"] })}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="all">Todos os status</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <select
            value={filters.periodo}
            onChange={(e) => update({ periodo: e.target.value as Filters["periodo"] })}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="all">Todo o período</option>
          </select>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium",
              showAdvanced
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-background hover:bg-secondary",
            )}
          >
            <Filter className="size-4" /> Filtros avançados
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-3 grid grid-cols-1 gap-3 border-t border-border pt-3 sm:grid-cols-2">
            <input
              type="text"
              value={filters.fornecedor}
              onChange={(e) => update({ fornecedor: e.target.value })}
              placeholder="Filtrar por fornecedor"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={filters.orgao}
              onChange={(e) => update({ orgao: e.target.value })}
              placeholder="Filtrar por órgão"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        )}

        {hasActive && (
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
            <span>Filtros ativos</span>
            <button
              type="button"
              onClick={reset}
              className="font-medium text-primary hover:underline"
            >
              Limpar tudo
            </button>
          </div>
        )}
      </div>

      {/* Quick status tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        <StatusChip
          label="Todos"
          active={filters.status === "all"}
          onClick={() => update({ status: "all" })}
        />
        {(["pending_approval", "approved", "in_production", "ready_for_delivery", "delivered"] as OrderStatus[]).map(
          (s) => (
            <button
              key={s}
              type="button"
              onClick={() => update({ status: s })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filters.status === s
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40",
              )}
            >
              <StatusBadge status={s} className="!bg-transparent !text-current !p-0" />
            </button>
          ),
        )}
      </div>

      <SectionCard title="Resultados" description="0 ordens encontradas">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Número</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Fornecedor</th>
                <th className="px-3 py-2">Órgão</th>
                <th className="px-3 py-2">Solicitante</th>
                <th className="px-3 py-2">Entrega</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="bg-card p-0">
                  <EmptyState
                    icon={ClipboardList}
                    title="Nenhuma ordem corresponde aos filtros"
                    description="Quando o backend estiver conectado, as ordens da sua organização aparecerão aqui automaticamente, respeitando RLS por perfil e tenant."
                    action={
                      <Link
                        to="/app/ordens/nova"
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
                      >
                        <Plus className="size-4" /> Criar primeira ordem
                      </Link>
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function StatusChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40",
      )}
    >
      {label}
    </button>
  );
}

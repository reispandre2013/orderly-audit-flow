import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckSquare,
  XSquare,
  MessageSquareWarning,
  ChevronRight,
  Filter,
  Inbox,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";
import { KPICard } from "@/components/kpi-card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/aprovacoes")({
  head: () => ({ meta: [{ title: "Fila de aprovação — SisPão Público" }] }),
  component: AprovacoesPage,
});

type Tab = "pending" | "today" | "mine" | "all";

function AprovacoesPage() {
  const [tab, setTab] = useState<Tab>("pending");

  return (
    <div>
      <PageHeader
        breadcrumb="Operação / Aprovações"
        title="Fila de aprovação"
        description="Revise, aprove, rejeite ou solicite ajuste em ordens. Cada decisão é assinada com seus dados de identidade e auditoria."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary">
            <Filter className="size-4" /> Filtros
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard label="Aguardando aprovação" value="—" icon={Inbox} tone="warning" />
        <KPICard label="Aprovadas hoje" value="—" icon={CheckSquare} tone="success" />
        <KPICard label="Rejeitadas hoje" value="—" icon={XSquare} />
        <KPICard label="Em ajuste" value="—" icon={MessageSquareWarning} tone="primary" />
      </div>

      <div className="mt-6 mb-3 flex flex-wrap gap-2 border-b border-border">
        {(
          [
            { id: "pending", label: "Pendentes" },
            { id: "today", label: "De hoje" },
            { id: "mine", label: "Minhas decisões" },
            { id: "all", label: "Todas" },
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "border-b-2 px-3 pb-2 pt-1 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard title="Ordens nesta visão" description="0 ordens">
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Número</th>
                  <th className="px-3 py-2">Solicitante</th>
                  <th className="px-3 py-2">Fornecedor</th>
                  <th className="px-3 py-2">Itens</th>
                  <th className="px-3 py-2 text-right">Total</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="bg-card p-0">
                    <EmptyState
                      icon={Inbox}
                      title="Nenhuma ordem nesta fila"
                      description="Quando solicitantes enviarem ordens para sua aprovação, elas aparecerão aqui ordenadas por urgência."
                      action={
                        <Link
                          to="/app/ordens"
                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary"
                        >
                          Ver todas as ordens <ChevronRight className="size-4" />
                        </Link>
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Painel de revisão" description="Selecione uma ordem para revisar">
          <EmptyState
            icon={CheckSquare}
            title="Nenhuma ordem selecionada"
            description="Ao clicar em uma linha da fila, abrirá aqui o painel de revisão com itens, comentários e ações de Aprovar / Rejeitar / Solicitar ajuste."
          />
          <div className="mt-5 space-y-2 text-xs text-muted-foreground">
            <p className="font-semibold uppercase tracking-wider">Atalhos</p>
            <ul className="space-y-1">
              <li>
                <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px]">A</kbd>{" "}
                Aprovar a selecionada
              </li>
              <li>
                <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px]">R</kbd>{" "}
                Rejeitar
              </li>
              <li>
                <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px]">C</kbd>{" "}
                Comentar / pedir ajuste
              </li>
              <li>
                <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>{" "}
                Navegar entre ordens
              </li>
            </ul>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

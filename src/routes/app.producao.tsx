import { createFileRoute } from "@tanstack/react-router";
import {
  Truck,
  Inbox,
  ChefHat,
  PackageCheck,
  CheckCircle2,
  Upload,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KPICard } from "@/components/kpi-card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/producao")({
  head: () => ({ meta: [{ title: "Produção & Entrega — SisPão Público" }] }),
  component: ProducaoPage,
});

interface Column {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "muted" | "primary" | "production" | "success";
}

const COLUMNS: Column[] = [
  {
    id: "received",
    title: "Recebidos",
    description: "Aceitar para iniciar produção",
    icon: Inbox,
    tone: "muted",
  },
  {
    id: "in_production",
    title: "Em produção",
    description: "Em fabricação ou separação",
    icon: ChefHat,
    tone: "production",
  },
  {
    id: "ready",
    title: "Prontos para entrega",
    description: "Aguardando saída do veículo",
    icon: PackageCheck,
    tone: "primary",
  },
  {
    id: "delivered",
    title: "Entregues",
    description: "Confirmados pelo recebedor",
    icon: CheckCircle2,
    tone: "success",
  },
];

const TONE_HEADER: Record<Column["tone"], string> = {
  muted: "border-border bg-card",
  primary: "border-primary/40 bg-primary-soft",
  production: "border-status-production/40 bg-status-production/15",
  success: "border-status-delivered/40 bg-status-delivered/15",
};

function ProducaoPage() {
  return (
    <div>
      <PageHeader
        breadcrumb="Operação / Produção"
        title="Produção & Entrega"
        description="Visão kanban dos pedidos do seu fornecedor. Arraste para mover entre etapas e anexe comprovantes em cada transição."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary">
            <Upload className="size-4" /> Comprovante em lote
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard label="Pedidos hoje" value="—" icon={Inbox} />
        <KPICard label="Em produção agora" value="—" icon={ChefHat} tone="primary" />
        <KPICard label="Aguardando saída" value="—" icon={Truck} tone="accent" />
        <KPICard label="Entregues no mês" value="—" icon={CheckCircle2} tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const Icon = col.icon;
          return (
            <section
              key={col.id}
              className="flex min-h-[420px] flex-col rounded-xl border border-border bg-surface shadow-card"
            >
              <header
                className={cn(
                  "flex items-center justify-between gap-2 rounded-t-xl border-b px-4 py-3",
                  TONE_HEADER[col.tone],
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="size-4 text-foreground shrink-0" />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">{col.title}</h3>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {col.description}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-background px-2 py-0.5 text-xs font-bold tabular-nums">
                  0
                </span>
              </header>

              <div className="flex flex-1 flex-col gap-3 p-3">
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/40 p-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Sem ordens nesta etapa
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Os cards aparecerão aqui quando o backend estiver conectado.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-background py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
                >
                  <Plus className="size-3.5" /> Adicionar manualmente
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-primary/30 bg-primary-soft/60 p-4 text-xs text-foreground">
        <strong className="text-primary">Dica:</strong> ao mover um card para
        "Prontos" ou "Entregues", o sistema pedirá um anexo (foto ou nota fiscal). O upload é
        registrado na auditoria com hash do arquivo.
      </div>
    </div>
  );
}

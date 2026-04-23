import { createFileRoute } from "@tanstack/react-router";
import {
  Globe2,
  Building2,
  Truck,
  Users,
  ClipboardList,
  AlertTriangle,
  ShieldCheck,
  Activity,
  TrendingUp,
  Server,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { KPICard } from "@/components/kpi-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/app/master")({
  head: () => ({ meta: [{ title: "Painel Master — SisPão Público" }] }),
  component: MasterPanelPage,
});

function MasterPanelPage() {
  return (
    <div>
      <PageHeader
        breadcrumb="Governança / Painel Master"
        title="Painel Master"
        description="Visão global, irrestrita e auditada de todos os órgãos, fornecedores e operações do sistema."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" /> Acesso global
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard label="Órgãos ativos" value="—" icon={Building2} hint="Tenants públicos" />
        <KPICard label="Fornecedores" value="—" icon={Truck} tone="primary" hint="Habilitados" />
        <KPICard label="Usuários" value="—" icon={Users} tone="accent" hint="Todas as organizações" />
        <KPICard label="Ordens em andamento" value="—" icon={ClipboardList} tone="success" hint="≠ entregue/cancelado" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard label="Aguardando aprovação" value="—" icon={Activity} tone="warning" />
        <KPICard label="Em produção" value="—" icon={TrendingUp} tone="primary" />
        <KPICard label="Alertas críticos" value="—" icon={AlertTriangle} tone="warning" />
        <KPICard label="Eventos auditados (24h)" value="—" icon={ShieldCheck} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard
          title="Órgãos públicos"
          description="Tenants ativos com pedidos no período"
          className="xl:col-span-2"
          actions={
            <button className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-secondary">
              Gerenciar
            </button>
          }
        >
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Órgão</th>
                  <th className="px-3 py-2">Esfera</th>
                  <th className="px-3 py-2 text-right">Usuários</th>
                  <th className="px-3 py-2 text-right">Ordens (30d)</th>
                  <th className="px-3 py-2 text-right">Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="bg-card p-0">
                    <EmptyState
                      icon={Building2}
                      title="Nenhum órgão cadastrado"
                      description="Quando o backend estiver conectado, todos os órgãos aparecerão aqui com volume agregado."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Alertas críticos" description="Requerem atenção imediata">
          <EmptyState
            icon={AlertTriangle}
            title="Sem alertas"
            description="Falhas de aprovação, ordens travadas, fornecedores inativos com pedidos pendentes — tudo aparecerá aqui."
          />
        </SectionCard>

        <SectionCard
          title="Fornecedores"
          description="Performance no período"
          className="xl:col-span-2"
        >
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Fornecedor</th>
                  <th className="px-3 py-2">CNPJ</th>
                  <th className="px-3 py-2 text-right">Pedidos</th>
                  <th className="px-3 py-2 text-right">Entrega no prazo</th>
                  <th className="px-3 py-2 text-right">Recusas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="bg-card p-0">
                    <EmptyState
                      icon={Truck}
                      title="Nenhum fornecedor"
                      description="Lista global de fornecedores com KPIs de cumprimento."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Saúde do sistema" description="Monitoramento em tempo real">
          <ul className="space-y-3 text-sm">
            <HealthRow icon={Server} label="API & banco" status="—" />
            <HealthRow icon={ShieldCheck} label="Auth provider" status="—" />
            <HealthRow icon={Activity} label="Fila de notificações" status="—" />
            <HealthRow icon={Globe2} label="Storage de anexos" status="—" />
          </ul>
        </SectionCard>

        <SectionCard
          title="Atividade recente"
          description="Últimos eventos críticos do sistema"
          className="xl:col-span-3"
        >
          <EmptyState
            icon={Activity}
            title="Sem atividade"
            description="Cada login, criação, aprovação, recusa, entrega e mudança de configuração será registrada aqui em tempo real."
          />
        </SectionCard>
      </div>
    </div>
  );
}

function HealthRow({
  icon: Icon,
  label,
  status,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  status: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 last:border-b-0 last:pb-0">
      <span className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-foreground">{label}</span>
      </span>
      <span className="font-mono text-xs text-muted-foreground">{status}</span>
    </li>
  );
}

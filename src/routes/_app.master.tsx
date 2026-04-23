import { createFileRoute } from "@tanstack/react-router";
import { Globe2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";
import { KPICard } from "@/components/kpi-card";

export const Route = createFileRoute("/_app/master")({
  head: () => ({ meta: [{ title: "Painel Master — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader
        breadcrumb="Governança / Master"
        title="Painel Master"
        description="Visão global de todos os órgãos, fornecedores e indicadores do sistema."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Órgãos ativos" value="—" />
        <KPICard label="Fornecedores ativos" value="—" />
        <KPICard label="Pedidos em andamento" value="—" tone="primary" />
        <KPICard label="Alertas críticos" value="—" tone="accent" />
      </div>
      <div className="mt-6">
        <SectionCard title="Monitoramento global">
          <EmptyState icon={Globe2} title="Aguardando dados globais" />
        </SectionCard>
      </div>
    </div>
  ),
});

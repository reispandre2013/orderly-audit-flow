import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_app/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader breadcrumb="Administrativo / Relatórios" title="Relatórios" description="Relatórios operacionais e gerenciais." />
      <SectionCard>
        <EmptyState icon={BarChart3} title="Sem relatórios disponíveis" />
      </SectionCard>
    </div>
  ),
});

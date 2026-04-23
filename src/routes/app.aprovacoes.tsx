import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/app/aprovacoes")({
  head: () => ({ meta: [{ title: "Fila de aprovação — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader
        breadcrumb="Operação / Aprovações"
        title="Fila de aprovação"
        description="Ordens aguardando revisão e assinatura do coordenador."
      />
      <SectionCard>
        <EmptyState icon={CheckSquare} title="Sem ordens aguardando aprovação" />
      </SectionCard>
    </div>
  ),
});

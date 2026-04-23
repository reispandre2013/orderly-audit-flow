import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/app/orgaos")({
  head: () => ({ meta: [{ title: "Órgãos públicos — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader breadcrumb="Governança / Órgãos" title="Órgãos públicos" description="Gestão dos órgãos clientes." />
      <SectionCard>
        <EmptyState icon={Building2} title="Nenhum órgão cadastrado" />
      </SectionCard>
    </div>
  ),
});

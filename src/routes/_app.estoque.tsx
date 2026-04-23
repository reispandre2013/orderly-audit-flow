import { createFileRoute } from "@tanstack/react-router";
import { Boxes } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_app/estoque")({
  head: () => ({ meta: [{ title: "Estoque — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader breadcrumb="Catálogo / Estoque" title="Estoque" description="Posições de estoque por produto e lote." />
      <SectionCard>
        <EmptyState icon={Boxes} title="Sem posições de estoque" />
      </SectionCard>
    </div>
  ),
});

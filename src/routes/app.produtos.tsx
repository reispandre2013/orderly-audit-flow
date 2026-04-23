import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_app/produtos")({
  head: () => ({ meta: [{ title: "Produtos — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader breadcrumb="Catálogo / Produtos" title="Produtos" description="Catálogo por fornecedor." />
      <SectionCard>
        <EmptyState icon={Package} title="Nenhum produto cadastrado" />
      </SectionCard>
    </div>
  ),
});

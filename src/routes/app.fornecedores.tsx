import { createFileRoute } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/app/fornecedores")({
  head: () => ({ meta: [{ title: "Fornecedores — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader breadcrumb="Catálogo / Fornecedores" title="Fornecedores" description="Cadastro e gestão de fornecedores credenciados." />
      <SectionCard>
        <EmptyState icon={Truck} title="Nenhum fornecedor credenciado" />
      </SectionCard>
    </div>
  ),
});

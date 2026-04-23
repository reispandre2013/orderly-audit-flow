import { createFileRoute } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_app/producao")({
  head: () => ({ meta: [{ title: "Produção & Entrega — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader
        breadcrumb="Operação / Produção"
        title="Produção & Entrega"
        description="Pedidos recebidos do órgão público para produção e entrega."
      />
      <SectionCard>
        <EmptyState icon={Truck} title="Sem pedidos em produção" />
      </SectionCard>
    </div>
  ),
});

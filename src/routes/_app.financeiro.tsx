import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_app/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader breadcrumb="Administrativo / Financeiro" title="Financeiro" description="Empenhos, pagamentos e conciliação." />
      <SectionCard>
        <EmptyState icon={Wallet} title="Sem movimentações financeiras" />
      </SectionCard>
    </div>
  ),
});

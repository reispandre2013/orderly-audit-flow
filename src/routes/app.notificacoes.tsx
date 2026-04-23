import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_app/notificacoes")({
  head: () => ({ meta: [{ title: "Notificações — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader breadcrumb="Visão geral / Notificações" title="Notificações" />
      <SectionCard>
        <EmptyState icon={Bell} title="Sem notificações" />
      </SectionCard>
    </div>
  ),
});

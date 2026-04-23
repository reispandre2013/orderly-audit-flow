import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/app/auditoria")({
  head: () => ({ meta: [{ title: "Auditoria — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader
        breadcrumb="Administrativo / Auditoria"
        title="Auditoria global"
        description="Trilha completa de eventos críticos: ator, IP, dispositivo, diff e timestamp."
      />
      <SectionCard>
        <EmptyState icon={ShieldCheck} title="Sem registros ainda" description="Eventos de auditoria aparecerão aqui." />
      </SectionCard>
    </div>
  ),
});

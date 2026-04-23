import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_app/documentos")({
  head: () => ({ meta: [{ title: "Anexos & Dossiês — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader breadcrumb="Governança / Documentos" title="Anexos & Dossiês" description="Central de anexos, fotos de evento e dossiês de ordens." />
      <SectionCard>
        <EmptyState icon={FileText} title="Sem documentos disponíveis" />
      </SectionCard>
    </div>
  ),
});

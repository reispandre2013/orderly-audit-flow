import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_app/ordens/")({
  head: () => ({ meta: [{ title: "Ordens de compra — SisPão Público" }] }),
  component: OrdensPage,
});

function OrdensPage() {
  return (
    <div>
      <PageHeader
        breadcrumb="Operação / Ordens"
        title="Ordens de compra"
        description="Liste, filtre e acompanhe todas as ordens com rastreabilidade completa."
        actions={
          <Link
            to="/app/ordens/nova"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Nova ordem
          </Link>
        }
      />
      <SectionCard title="Todas as ordens">
        <EmptyState
          icon={ClipboardList}
          title="Nenhuma ordem registrada"
          description="As ordens aparecerão aqui assim que forem criadas. Cada ordem terá seu dossiê completo, timeline e auditoria."
        />
      </SectionCard>
    </div>
  );
}

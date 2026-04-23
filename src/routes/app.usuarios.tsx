import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/_app/usuarios")({
  head: () => ({ meta: [{ title: "Usuários — SisPão Público" }] }),
  component: () => (
    <div>
      <PageHeader breadcrumb="Governança / Usuários" title="Usuários" description="Gestão de usuários, perfis e permissões." />
      <SectionCard>
        <EmptyState icon={Users} title="Sem usuários cadastrados" />
      </SectionCard>
    </div>
  ),
});

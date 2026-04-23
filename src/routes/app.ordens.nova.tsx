import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";

export const Route = createFileRoute("/app/ordens/nova")({
  head: () => ({ meta: [{ title: "Nova ordem — SisPão Público" }] }),
  component: NovaOrdemPage,
});

function NovaOrdemPage() {
  return (
    <div>
      <PageHeader
        breadcrumb="Operação / Ordens / Nova"
        title="Nova ordem de compra"
        description="Selecione o fornecedor e adicione os itens. Metadados de auditoria serão capturados automaticamente."
        actions={
          <Link
            to="/app/ordens"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary"
          >
            <ArrowLeft className="size-4" /> Voltar
          </Link>
        }
      />
      <SectionCard title="Formulário em construção" description="Será habilitado na próxima fase">
        <p className="text-sm text-muted-foreground">
          O formulário completo (fornecedor → produtos do fornecedor, itens por unidade/lote, local
          de entrega, data, horário, departamento, equipe, observações, anexos e captura de
          metadados de auditoria) será implementado quando o backend estiver conectado.
        </p>
      </SectionCard>
    </div>
  );
}

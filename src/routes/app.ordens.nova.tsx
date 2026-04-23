import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Send, Save } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { WizardStepper, type WizardStep } from "@/components/order-wizard/wizard-stepper";
import { StepContext } from "@/components/order-wizard/step-context";
import { StepSupplier } from "@/components/order-wizard/step-supplier";
import { StepItems } from "@/components/order-wizard/step-items";
import { StepDelivery } from "@/components/order-wizard/step-delivery";
import { StepReview } from "@/components/order-wizard/step-review";
import { EMPTY_DRAFT, isStepValid, type OrderDraft } from "@/components/order-wizard/types";
import { collectDeviceInfo } from "@/lib/device-info";
import { toast } from "sonner";

export const Route = createFileRoute("/app/ordens/nova")({
  head: () => ({ meta: [{ title: "Nova ordem — SisPão Público" }] }),
  component: NovaOrdemPage,
});

const STEPS: WizardStep[] = [
  { id: "context", label: "Contexto", description: "Órgão, departamento, equipe" },
  { id: "supplier", label: "Fornecedor", description: "Selecione o fornecedor" },
  { id: "items", label: "Itens", description: "Produtos e quantidades" },
  { id: "delivery", label: "Entrega", description: "Local, data, observações" },
  { id: "review", label: "Revisão", description: "Conferir e enviar" },
];

function NovaOrdemPage() {
  const [draft, setDraft] = useState<OrderDraft>(EMPTY_DRAFT);
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();

  const patch = (p: Partial<OrderDraft>) => setDraft((d) => ({ ...d, ...p }));

  const canAdvance = useMemo(() => isStepValid(draft, stepIndex), [draft, stepIndex]);
  const isLast = stepIndex === STEPS.length - 1;

  const goNext = () => {
    if (!canAdvance) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleSubmit = () => {
    // Captura metadados de auditoria — esta payload é o que será enviado ao Supabase.
    const audit = collectDeviceInfo();
    const payload = { draft, audit };
    // eslint-disable-next-line no-console
    console.info("[ordem] payload pronto para criação no Supabase:", payload);
    toast.success("Ordem pronta para envio", {
      description:
        "O payload foi montado e logado no console. Conecte o Supabase para persistir e disparar a fila de aprovação.",
    });
    navigate({ to: "/app/ordens" });
  };

  const handleSaveDraft = () => {
    toast.info("Rascunho salvo localmente", {
      description: "Persistência real chega quando o backend for conectado.",
    });
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Operação / Ordens / Nova"
        title="Nova ordem de compra"
        description="Preencha em 5 passos. Metadados de auditoria são capturados automaticamente ao enviar."
        actions={
          <Link
            to="/app/ordens"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary"
          >
            <ArrowLeft className="size-4" /> Cancelar
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <SectionCard title="Etapas" bodyClassName="p-3">
          <WizardStepper
            steps={STEPS}
            currentIndex={stepIndex}
            onStepClick={(i) => i <= stepIndex && setStepIndex(i)}
          />
        </SectionCard>

        <SectionCard
          title={STEPS[stepIndex].label}
          description={STEPS[stepIndex].description}
        >
          {stepIndex === 0 && <StepContext draft={draft} onChange={patch} />}
          {stepIndex === 1 && <StepSupplier draft={draft} onChange={patch} />}
          {stepIndex === 2 && <StepItems draft={draft} onChange={patch} />}
          {stepIndex === 3 && <StepDelivery draft={draft} onChange={patch} />}
          {stepIndex === 4 && <StepReview draft={draft} />}

          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              <ArrowLeft className="size-4" /> Voltar
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                <Save className="size-4" /> Salvar rascunho
              </button>
              {!isLast && (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canAdvance}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
                >
                  Avançar <ArrowRight className="size-4" />
                </button>
              )}
              {isLast && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:shadow-elevated"
                >
                  <Send className="size-4" /> Enviar para aprovação
                </button>
              )}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

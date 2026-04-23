import { ShieldCheck } from "lucide-react";
import { formatBRL } from "@/lib/format";
import type { OrderDraft } from "./types";
import { draftSubtotalCentavos } from "./types";

interface Props {
  draft: OrderDraft;
}

export function StepReview({ draft }: Props) {
  const total = draftSubtotalCentavos(draft);
  return (
    <div className="space-y-5">
      <Block title="Contexto">
        <Row k="Órgão" v={draft.orgao_id ?? "—"} />
        <Row k="Departamento" v={draft.departamento || "—"} />
        <Row k="Equipe" v={draft.equipe || "—"} />
      </Block>

      <Block title="Fornecedor">
        <Row k="Fornecedor" v={draft.fornecedor_id ?? "—"} />
      </Block>

      <Block title={`Itens (${draft.items.length})`}>
        {draft.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem itens.</p>
        ) : (
          <ul className="divide-y divide-border">
            {draft.items.map((it) => (
              <li key={it.localId} className="flex items-center justify-between py-2 text-sm">
                <span className="min-w-0 truncate">
                  {it.produto_nome || "Sem nome"}
                  <span className="ml-1.5 text-muted-foreground">
                    · {it.quantidade} {it.unidade}
                  </span>
                </span>
                <span className="font-medium tabular-nums">
                  {formatBRL(it.quantidade * it.preco_unitario_centavos)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm font-bold">
          <span>Total</span>
          <span className="tabular-nums">{formatBRL(total)}</span>
        </div>
      </Block>

      <Block title="Entrega">
        <Row k="Local" v={draft.local_entrega || "—"} />
        <Row k="Data" v={draft.data_entrega || "—"} />
        <Row k="Horário" v={draft.horario_entrega || "—"} />
        {draft.observacoes && <Row k="Obs." v={draft.observacoes} />}
      </Block>

      <div className="flex items-start gap-3 rounded-lg border border-primary/40 bg-primary-soft p-4 text-xs text-foreground">
        <ShieldCheck className="size-4 shrink-0 text-primary" />
        <p>
          Ao enviar para aprovação, serão registrados automaticamente{" "}
          <strong>IP, navegador, sistema operacional, dispositivo</strong> e a identidade do
          solicitante (CPF + matrícula). A ordem entrará na fila do coordenador responsável.
        </p>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium text-foreground">{v}</span>
    </div>
  );
}

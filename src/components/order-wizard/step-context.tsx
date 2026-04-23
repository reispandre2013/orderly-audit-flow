import { Building2 } from "lucide-react";
import type { OrderDraft } from "./types";

interface Props {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
}

export function StepContext({ draft, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
        <Building2 className="mb-1 inline size-4 text-primary" /> A lista de órgãos e equipes virá
        do banco quando o Supabase estiver conectado. Por ora preencha manualmente.
      </div>

      <Field label="Órgão público" required>
        <input
          type="text"
          placeholder="Ex.: Secretaria Municipal de Educação"
          value={draft.orgao_id ?? ""}
          onChange={(e) => onChange({ orgao_id: e.target.value })}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Departamento" required>
          <input
            type="text"
            placeholder="Ex.: Departamento de Alimentação Escolar"
            value={draft.departamento}
            onChange={(e) => onChange({ departamento: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Equipe / unidade" required>
          <input
            type="text"
            placeholder="Ex.: EMEF João da Silva"
            value={draft.equipe}
            onChange={(e) => onChange({ equipe: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}

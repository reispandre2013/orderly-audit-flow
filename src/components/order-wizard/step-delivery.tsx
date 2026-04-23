import type { OrderDraft } from "./types";

interface Props {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
}

export function StepDelivery({ draft, onChange }: Props) {
  return (
    <div className="space-y-5">
      <Field label="Local de entrega" required>
        <input
          type="text"
          placeholder="Endereço completo (rua, número, bairro, CEP)"
          value={draft.local_entrega}
          onChange={(e) => onChange({ local_entrega: e.target.value })}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Data de entrega" required>
          <input
            type="date"
            value={draft.data_entrega}
            onChange={(e) => onChange({ data_entrega: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Horário previsto">
          <input
            type="time"
            value={draft.horario_entrega}
            onChange={(e) => onChange({ horario_entrega: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <Field label="Observações para o fornecedor">
        <textarea
          rows={4}
          placeholder="Instruções de acesso, pessoa responsável pelo recebimento, restrições, etc."
          value={draft.observacoes}
          onChange={(e) => onChange({ observacoes: e.target.value })}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </Field>
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

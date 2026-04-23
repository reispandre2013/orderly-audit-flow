import { Truck } from "lucide-react";
import type { OrderDraft } from "./types";

interface Props {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
}

export function StepSupplier({ draft, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
        <Truck className="mb-1 inline size-4 text-primary" /> A busca por fornecedores ativos
        (e seu catálogo de produtos) será carregada do Supabase. O campo abaixo é provisório.
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Fornecedor <span className="text-destructive">*</span>
        </span>
        <input
          type="text"
          placeholder="Nome ou CNPJ do fornecedor"
          value={draft.fornecedor_id ?? ""}
          onChange={(e) => onChange({ fornecedor_id: e.target.value })}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </label>

      <p className="text-xs text-muted-foreground">
        Quando o backend estiver ativo, este campo vira um combobox com fornecedores cadastrados
        e somente os habilitados pelo seu órgão aparecerão.
      </p>
    </div>
  );
}

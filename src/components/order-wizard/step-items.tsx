import { Plus, Trash2 } from "lucide-react";
import { formatBRL } from "@/lib/format";
import type { OrderDraft, WizardItem } from "./types";
import { draftSubtotalCentavos } from "./types";

interface Props {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
}

const UNIDADES: WizardItem["unidade"][] = ["un", "kg", "g", "lt", "pct", "cx"];

function newItem(): WizardItem {
  return {
    localId: crypto.randomUUID(),
    produto_id: null,
    produto_nome: "",
    unidade: "un",
    quantidade: 1,
    preco_unitario_centavos: 0,
  };
}

export function StepItems({ draft, onChange }: Props) {
  const updateItem = (localId: string, patch: Partial<WizardItem>) => {
    onChange({
      items: draft.items.map((i) => (i.localId === localId ? { ...i, ...patch } : i)),
    });
  };
  const removeItem = (localId: string) =>
    onChange({ items: draft.items.filter((i) => i.localId !== localId) });
  const addItem = () => onChange({ items: [...draft.items, newItem()] });

  return (
    <div className="space-y-4">
      {draft.items.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">Nenhum item adicionado ainda.</p>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Adicionar primeiro item
          </button>
        </div>
      )}

      {draft.items.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2">Produto</th>
                <th className="px-3 py-2 w-24">Unidade</th>
                <th className="px-3 py-2 w-28">Qtd.</th>
                <th className="px-3 py-2 w-36">Preço unit.</th>
                <th className="px-3 py-2 w-32 text-right">Subtotal</th>
                <th className="px-3 py-2 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {draft.items.map((it) => (
                <tr key={it.localId} className="bg-card">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      placeholder="Pão francês 50g"
                      value={it.produto_nome}
                      onChange={(e) => updateItem(it.localId, { produto_nome: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={it.unidade}
                      onChange={(e) =>
                        updateItem(it.localId, { unidade: e.target.value as WizardItem["unidade"] })
                      }
                      className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                    >
                      {UNIDADES.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={it.quantidade}
                      onChange={(e) =>
                        updateItem(it.localId, { quantidade: Number(e.target.value) || 0 })
                      }
                      className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={(it.preco_unitario_centavos / 100).toFixed(2)}
                      onChange={(e) =>
                        updateItem(it.localId, {
                          preco_unitario_centavos: Math.round(
                            (Number(e.target.value) || 0) * 100,
                          ),
                        })
                      }
                      className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2 text-right text-sm font-medium tabular-nums">
                    {formatBRL(it.quantidade * it.preco_unitario_centavos)}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(it.localId)}
                      aria-label="Remover item"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-secondary/40">
              <tr>
                <td colSpan={4} className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total
                </td>
                <td className="px-3 py-2 text-right text-sm font-bold tabular-nums">
                  {formatBRL(draftSubtotalCentavos(draft))}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {draft.items.length > 0 && (
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary"
        >
          <Plus className="size-4" /> Adicionar outro item
        </button>
      )}
    </div>
  );
}

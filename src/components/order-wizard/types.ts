/**
 * Estado do wizard de criação de ordem.
 * Vive 100% em memória (useState) — ao plugar Supabase, basta enviar este
 * objeto para uma server function `createOrder()` que retorna o id criado.
 */
import type { Produto } from "@/lib/domain/types";

export interface WizardItem {
  /** id local (uuid) — só pra key/edição. Não é o id do banco. */
  localId: string;
  produto_id: string | null;
  produto_nome: string;
  unidade: Produto["unidade"];
  quantidade: number;
  preco_unitario_centavos: number;
}

export interface OrderDraft {
  // Etapa 1 — contexto
  orgao_id: string | null;
  departamento: string;
  equipe: string;

  // Etapa 2 — fornecedor
  fornecedor_id: string | null;

  // Etapa 3 — itens
  items: WizardItem[];

  // Etapa 4 — entrega
  local_entrega: string;
  data_entrega: string; // ISO yyyy-mm-dd
  horario_entrega: string; // HH:mm
  observacoes: string;
}

export const EMPTY_DRAFT: OrderDraft = {
  orgao_id: null,
  departamento: "",
  equipe: "",
  fornecedor_id: null,
  items: [],
  local_entrega: "",
  data_entrega: "",
  horario_entrega: "",
  observacoes: "",
};

export function draftSubtotalCentavos(d: OrderDraft): number {
  return d.items.reduce((acc, it) => acc + it.quantidade * it.preco_unitario_centavos, 0);
}

export function isStepValid(d: OrderDraft, stepIndex: number): boolean {
  switch (stepIndex) {
    case 0:
      return Boolean(d.orgao_id && d.departamento.trim() && d.equipe.trim());
    case 1:
      return Boolean(d.fornecedor_id);
    case 2:
      return d.items.length > 0 && d.items.every((i) => i.quantidade > 0 && i.produto_nome.trim());
    case 3:
      return Boolean(d.local_entrega.trim() && d.data_entrega);
    case 4:
      return true;
    default:
      return false;
  }
}

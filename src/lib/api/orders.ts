/**
 * API de Ordens — wrapper sobre o Supabase.
 *
 * Esqueleto: as queries reais dependem das tabelas serem criadas via migration
 * no Cursor. Cada função abaixo já está conectada ao cliente Supabase, mas pode
 * retornar arrays vazios enquanto o schema não existir.
 *
 * Sugestão de schema (Postgres):
 *   - orders            (Order)
 *   - order_items       (OrderItem)
 *   - order_timeline    (OrderTimelineEvent)
 *   - attachments       (Attachment)
 */
import { supabase } from "@/lib/supabase/client";
import type {
  Order,
  OrderWithItems,
  OrderTimelineEvent,
  AuditMeta,
} from "@/lib/domain/types";
import type { OrderDraft } from "@/components/order-wizard/types";

export interface ListOrdersFilters {
  status?: string[];
  fornecedor_id?: string;
  orgao_id?: string;
  search?: string;
  from?: string; // ISO date
  to?: string;   // ISO date
}

export async function listOrders(filters: ListOrdersFilters = {}): Promise<Order[]> {
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

  if (filters.status?.length) query = query.in("status", filters.status);
  if (filters.fornecedor_id) query = query.eq("fornecedor_id", filters.fornecedor_id);
  if (filters.orgao_id) query = query.eq("orgao_id", filters.orgao_id);
  if (filters.from) query = query.gte("created_at", filters.from);
  if (filters.to) query = query.lte("created_at", filters.to);
  if (filters.search) query = query.ilike("numero", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) {
    if (import.meta.env.DEV) console.warn("[orders.list]", error.message);
    return [];
  }
  return (data ?? []) as Order[];
}

export async function getOrder(id: string): Promise<OrderWithItems | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    if (import.meta.env.DEV) console.warn("[orders.get]", error.message);
    return null;
  }
  return data as OrderWithItems | null;
}

export async function getOrderTimeline(orderId: string): Promise<OrderTimelineEvent[]> {
  const { data, error } = await supabase
    .from("order_timeline")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });
  if (error) {
    if (import.meta.env.DEV) console.warn("[orders.timeline]", error.message);
    return [];
  }
  return (data ?? []) as OrderTimelineEvent[];
}

/**
 * Cria uma nova ordem a partir do draft do wizard.
 * Espera-se que uma RPC `create_order` exista no Postgres para garantir
 * atomicidade entre a inserção da ordem, dos itens e do evento de timeline.
 */
export async function createOrder(draft: OrderDraft, audit: AuditMeta): Promise<{ id: string | null; error: string | null }> {
  const { data, error } = await supabase.rpc("create_order", {
    payload: draft,
    audit_meta: audit,
  });
  if (error) return { id: null, error: error.message };
  return { id: (data as { id: string } | null)?.id ?? null, error: null };
}

export async function approveOrder(orderId: string, comment?: string) {
  const { error } = await supabase.rpc("approve_order", { order_id: orderId, comment });
  return { error: error?.message ?? null };
}

export async function rejectOrder(orderId: string, reason: string) {
  const { error } = await supabase.rpc("reject_order", { order_id: orderId, reason });
  return { error: error?.message ?? null };
}

export async function sendOrderToSupplier(orderId: string) {
  const { error } = await supabase.rpc("send_order_to_supplier", { order_id: orderId });
  return { error: error?.message ?? null };
}

export async function startProduction(orderId: string) {
  const { error } = await supabase.rpc("start_production", { order_id: orderId });
  return { error: error?.message ?? null };
}

export async function markDelivered(orderId: string) {
  const { error } = await supabase.rpc("mark_delivered", { order_id: orderId });
  return { error: error?.message ?? null };
}

/**
 * Estados do ciclo de vida de uma ordem de compra.
 * Espelha a enum `order_status` no banco.
 */
export const ORDER_STATUSES = [
  "draft",
  "pending_approval",
  "approved",
  "rejected",
  "sent_to_supplier",
  "accepted_by_supplier",
  "rejected_by_supplier",
  "in_production",
  "ready_for_delivery",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  draft: "Rascunho",
  pending_approval: "Aguardando aprovação",
  approved: "Aprovado",
  rejected: "Recusado",
  sent_to_supplier: "Enviado ao fornecedor",
  accepted_by_supplier: "Aceito pelo fornecedor",
  rejected_by_supplier: "Recusado pelo fornecedor",
  in_production: "Em produção",
  ready_for_delivery: "Pronto para entrega",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

/** Mapeia o status para um token semântico de cor (ver design system). */
export type StatusTone = "draft" | "pending" | "approved" | "production" | "delivered" | "rejected";

export const ORDER_STATUS_TONE: Record<OrderStatus, StatusTone> = {
  draft: "draft",
  pending_approval: "pending",
  approved: "approved",
  rejected: "rejected",
  sent_to_supplier: "approved",
  accepted_by_supplier: "approved",
  rejected_by_supplier: "rejected",
  in_production: "production",
  ready_for_delivery: "production",
  delivered: "delivered",
  cancelled: "rejected",
};

/**
 * Tipos de domínio do sistema.
 * Estes tipos espelham (e serão substituídos por) os tipos gerados do Supabase
 * em src/integrations/supabase/types.ts assim que a integração for habilitada.
 */
import type { AppRole } from "./roles";
import type { OrderStatus } from "./order-status";

export type UUID = string;
export type ISODateString = string;

/** Multitenant: cada órgão e cada fornecedor é um tenant lógico. */
export interface Tenant {
  id: UUID;
  type: "orgao" | "fornecedor";
  name: string;
  cnpj: string | null;
  active: boolean;
  created_at: ISODateString;
}

export interface UserProfile {
  id: UUID; // = auth.users.id
  full_name: string;
  email: string;
  cpf: string;
  matricula: string;
  phone: string | null;
  orgao_id: UUID | null;
  fornecedor_id: UUID | null;
  departamento: string | null;
  equipe: string | null;
  active: boolean;
  created_at: ISODateString;
}

export interface UserWithRoles extends UserProfile {
  roles: AppRole[];
}

export interface Fornecedor {
  id: UUID;
  tenant_id: UUID;
  razao_social: string;
  nome_fantasia: string | null;
  cnpj: string;
  email_contato: string | null;
  telefone: string | null;
  whatsapp: string | null;
  active: boolean;
  created_at: ISODateString;
}

export interface Orgao {
  id: UUID;
  tenant_id: UUID;
  nome: string;
  cnpj: string | null;
  esfera: "federal" | "estadual" | "municipal" | null;
  active: boolean;
  created_at: ISODateString;
}

export interface Produto {
  id: UUID;
  fornecedor_id: UUID;
  codigo: string;
  nome: string;
  descricao: string | null;
  unidade: "un" | "kg" | "g" | "lt" | "pct" | "cx";
  preco_unitario_centavos: number;
  ativo: boolean;
  created_at: ISODateString;
}

export interface OrderItem {
  id: UUID;
  order_id: UUID;
  produto_id: UUID;
  produto_nome_snapshot: string;
  unidade: Produto["unidade"];
  quantidade: number;
  preco_unitario_centavos: number;
  subtotal_centavos: number;
}

/** Metadados de auditoria capturados no momento da criação da ordem. */
export interface AuditMeta {
  ip: string | null;
  user_agent: string | null;
  os: string | null;
  browser: string | null;
  device: string | null;
}

export interface Order {
  id: UUID;
  numero: string; // ex: "2025-000123"
  status: OrderStatus;
  orgao_id: UUID;
  fornecedor_id: UUID;
  solicitante_id: UUID;
  coordenador_id: UUID | null;
  departamento: string | null;
  equipe: string | null;
  local_entrega: string;
  data_entrega: ISODateString;
  horario_entrega: string | null;
  observacoes: string | null;
  total_centavos: number;
  audit: AuditMeta;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  solicitante?: UserProfile;
  coordenador?: UserProfile | null;
  fornecedor?: Fornecedor;
  orgao?: Orgao;
}

/** Evento na timeline/dossiê de uma ordem. */
export interface OrderTimelineEvent {
  id: UUID;
  order_id: UUID;
  event_type:
    | "created"
    | "submitted"
    | "approved"
    | "rejected"
    | "signed"
    | "sent_to_supplier"
    | "accepted_by_supplier"
    | "rejected_by_supplier"
    | "production_started"
    | "production_sent_whatsapp"
    | "ready_for_delivery"
    | "delivered"
    | "attachment_added"
    | "comment_added"
    | "cancelled";
  actor_id: UUID;
  actor_name: string;
  actor_role: AppRole;
  payload: Record<string, unknown> | null;
  created_at: ISODateString;
}

export interface Attachment {
  id: UUID;
  order_id: UUID;
  uploaded_by: UUID;
  file_name: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  kind: "anexo" | "foto_evento" | "nota_fiscal" | "comprovante";
  created_at: ISODateString;
}

export interface AuditLogEntry {
  id: UUID;
  actor_id: UUID | null;
  actor_role: AppRole | null;
  action: string;
  entity_type: string;
  entity_id: UUID | null;
  diff: Record<string, unknown> | null;
  ip: string | null;
  user_agent: string | null;
  created_at: ISODateString;
}

export interface NotificationItem {
  id: UUID;
  user_id: UUID;
  title: string;
  body: string;
  link: string | null;
  read_at: ISODateString | null;
  created_at: ISODateString;
}

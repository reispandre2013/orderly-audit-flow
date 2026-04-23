/**
 * Definição da navegação por módulo, com filtro por role.
 * Cada item declara quais roles podem vê-lo.
 */
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  Truck,
  Package,
  Boxes,
  Wallet,
  BarChart3,
  ShieldCheck,
  Bell,
  Users,
  Building2,
  Globe2,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { AppRole } from "@/lib/domain/roles";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: AppRole[];
  badgeKey?: "pending_approval" | "new_orders" | "alerts";
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Visão geral",
    items: [
      {
        to: "/app",
        label: "Dashboard",
        icon: LayoutDashboard,
        roles: ["solicitante", "coordenador", "fornecedor", "admin_fornecedor", "admin_orgao", "master"],
      },
      {
        to: "/app/notificacoes",
        label: "Notificações",
        icon: Bell,
        roles: ["solicitante", "coordenador", "fornecedor", "admin_fornecedor", "admin_orgao", "master"],
      },
    ],
  },
  {
    title: "Operação",
    items: [
      {
        to: "/app/ordens",
        label: "Ordens de compra",
        icon: ClipboardList,
        roles: ["solicitante", "coordenador", "fornecedor", "admin_fornecedor", "admin_orgao", "master"],
      },
      {
        to: "/app/aprovacoes",
        label: "Fila de aprovação",
        icon: CheckSquare,
        roles: ["coordenador", "admin_orgao", "master"],
        badgeKey: "pending_approval",
      },
      {
        to: "/app/producao",
        label: "Produção & Entrega",
        icon: Truck,
        roles: ["fornecedor", "admin_fornecedor", "master"],
        badgeKey: "new_orders",
      },
    ],
  },
  {
    title: "Catálogo",
    items: [
      {
        to: "/app/produtos",
        label: "Produtos",
        icon: Package,
        roles: ["fornecedor", "admin_fornecedor", "admin_orgao", "master"],
      },
      {
        to: "/app/estoque",
        label: "Estoque",
        icon: Boxes,
        roles: ["fornecedor", "admin_fornecedor", "master"],
      },
      {
        to: "/app/fornecedores",
        label: "Fornecedores",
        icon: Truck,
        roles: ["admin_orgao", "master"],
      },
    ],
  },
  {
    title: "Administrativo",
    items: [
      {
        to: "/app/financeiro",
        label: "Financeiro",
        icon: Wallet,
        roles: ["admin_orgao", "admin_fornecedor", "master"],
      },
      {
        to: "/app/relatorios",
        label: "Relatórios",
        icon: BarChart3,
        roles: ["coordenador", "admin_orgao", "admin_fornecedor", "master"],
      },
      {
        to: "/app/auditoria",
        label: "Auditoria",
        icon: ShieldCheck,
        roles: ["admin_orgao", "master"],
      },
    ],
  },
  {
    title: "Governança",
    items: [
      {
        to: "/app/usuarios",
        label: "Usuários",
        icon: Users,
        roles: ["admin_orgao", "admin_fornecedor", "master"],
      },
      {
        to: "/app/orgaos",
        label: "Órgãos públicos",
        icon: Building2,
        roles: ["master"],
      },
      {
        to: "/app/master",
        label: "Painel Master",
        icon: Globe2,
        roles: ["master"],
      },
      {
        to: "/app/documentos",
        label: "Anexos & dossiês",
        icon: FileText,
        roles: ["coordenador", "admin_orgao", "master"],
      },
    ],
  },
];

export function filterNavGroupsByRole(role: AppRole | null): NavGroup[] {
  if (!role) return [];
  return NAV_GROUPS
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0);
}

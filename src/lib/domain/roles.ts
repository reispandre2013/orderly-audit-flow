/**
 * Perfis de acesso do sistema.
 * Espelha a enum `app_role` que será criada no Postgres (Supabase).
 * NUNCA armazene roles em colunas de profile/user — sempre em `user_roles`.
 */
export const ROLES = [
  "solicitante",
  "coordenador",
  "fornecedor",
  "admin_fornecedor",
  "admin_orgao",
  "master",
] as const;

export type AppRole = (typeof ROLES)[number];

export const ROLE_LABEL: Record<AppRole, string> = {
  solicitante: "Solicitante",
  coordenador: "Coordenador",
  fornecedor: "Fornecedor",
  admin_fornecedor: "Admin Fornecedor",
  admin_orgao: "Admin do Órgão",
  master: "Master",
};

export const ROLE_DESCRIPTION: Record<AppRole, string> = {
  solicitante: "Cria ordens de compra para sua equipe",
  coordenador: "Revisa, aprova e assina ordens",
  fornecedor: "Recebe pedidos e gerencia produção",
  admin_fornecedor: "Administra equipe, catálogo e estoque do fornecedor",
  admin_orgao: "Administra o órgão público (usuários, equipes, fornecedores)",
  master: "Acesso global ao sistema (governança e auditoria)",
};

/** Roles que podem aprovar/assinar ordens. */
export const APPROVAL_ROLES: AppRole[] = ["coordenador", "admin_orgao", "master"];

/** Roles do lado órgão público. */
export const ORGAO_ROLES: AppRole[] = ["solicitante", "coordenador", "admin_orgao"];

/** Roles do lado fornecedor. */
export const FORNECEDOR_ROLES: AppRole[] = ["fornecedor", "admin_fornecedor"];

/** Apenas master pode promover outro master (regra obrigatória). */
export function canCreateMaster(actor: AppRole): boolean {
  return actor === "master";
}

export function isOrgaoRole(role: AppRole): boolean {
  return ORGAO_ROLES.includes(role);
}

export function isFornecedorRole(role: AppRole): boolean {
  return FORNECEDOR_ROLES.includes(role);
}

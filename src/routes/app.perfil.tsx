import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth/auth-context";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { RoleBadge } from "@/components/role-badge";
import { formatCPF, formatPhone } from "@/lib/format";

export const Route = createFileRoute("/app/perfil")({
  head: () => ({ meta: [{ title: "Meu perfil — SisPão Público" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader breadcrumb="Conta / Perfil" title="Meu perfil" />
      <SectionCard title="Dados cadastrais">
        {user ? (
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <Item label="Nome" value={user.full_name} />
            <Item label="E-mail" value={user.email} />
            <Item label="CPF" value={formatCPF(user.cpf)} />
            <Item label="Matrícula" value={user.matricula} />
            <Item label="Telefone" value={user.phone ? formatPhone(user.phone) : "—"} />
            <Item label="Departamento" value={user.departamento ?? "—"} />
            <Item label="Equipe" value={user.equipe ?? "—"} />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Perfis</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {user.roles.map((r) => <RoleBadge key={r} role={r} />)}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sessão indisponível. Faça login para visualizar seu perfil.
          </p>
        )}
      </SectionCard>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}

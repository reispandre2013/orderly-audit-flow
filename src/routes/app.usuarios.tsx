import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  ShieldCheck,
  Building2,
  Truck,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";
import { KPICard } from "@/components/kpi-card";
import { RoleBadge } from "@/components/role-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES, ROLE_LABEL, type AppRole } from "@/lib/domain/roles";
import { formatCPF } from "@/lib/format";

export const Route = createFileRoute("/app/usuarios")({
  head: () => ({ meta: [{ title: "Usuários — SisPão Público" }] }),
  component: UsuariosPage,
});

interface UsuarioRow {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  matricula: string;
  vinculo: string; // órgão ou fornecedor
  vinculo_tipo: "orgao" | "fornecedor";
  roles: AppRole[];
  active: boolean;
}

function UsuariosPage() {
  const [tab, setTab] = useState("ativos");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("todos");
  const [vinculoFilter, setVinculoFilter] = useState<string>("todos");

  const users: UsuarioRow[] = [];

  return (
    <div>
      <PageHeader
        breadcrumb="Governança / Usuários"
        title="Usuários"
        description="Gestão de usuários, perfis e permissões. Roles vivem em tabela separada (user_roles)."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Mail className="size-4" /> Convidar por e-mail
            </Button>
            <Button size="sm">
              <UserPlus className="size-4" /> Novo usuário
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total de usuários" value={0} icon={Users} tone="primary" />
        <KPICard label="Ativos" value={0} icon={ShieldCheck} tone="success" />
        <KPICard label="Convites pendentes" value={0} icon={Mail} tone="warning" />
        <KPICard label="Masters do sistema" value={0} hint="Acesso global" />
      </div>

      <SectionCard
        title="Diretório de usuários"
        actions={
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="ativos">Ativos</TabsTrigger>
              <TabsTrigger value="convites">Convites</TabsTrigger>
              <TabsTrigger value="inativos">Inativos</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, e-mail, CPF ou matrícula..."
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os perfis</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABEL[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={vinculoFilter} onValueChange={setVinculoFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vínculo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os vínculos</SelectItem>
              <SelectItem value="orgao">Órgãos públicos</SelectItem>
              <SelectItem value="fornecedor">Fornecedores</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Sem usuários cadastrados"
            description="Convide usuários por e-mail ou cadastre manualmente. Atribua perfis (roles) e vincule a um órgão ou fornecedor."
            action={
              <Button size="sm">
                <UserPlus className="size-4" /> Cadastrar primeiro usuário
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead className="w-[160px]">CPF / Matrícula</TableHead>
                  <TableHead>Vínculo</TableHead>
                  <TableHead>Perfis</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium">{u.nome}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-xs">{formatCPF(u.cpf)}</div>
                      <div className="text-xs text-muted-foreground">Mat. {u.matricula}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        {u.vinculo_tipo === "orgao" ? (
                          <Building2 className="size-3.5 text-muted-foreground" />
                        ) : (
                          <Truck className="size-3.5 text-muted-foreground" />
                        )}
                        {u.vinculo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <RoleBadge key={r} role={r} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.active ? "default" : "secondary"}>
                        {u.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

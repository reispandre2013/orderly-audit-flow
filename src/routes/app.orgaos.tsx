import { createFileRoute } from "@tanstack/react-router";
import { Building2, Plus, Search, Users, MapPin } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";
import { KPICard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

export const Route = createFileRoute("/app/orgaos")({
  head: () => ({ meta: [{ title: "Órgãos públicos — SisPão Público" }] }),
  component: OrgaosPage,
});

interface OrgaoRow {
  id: string;
  nome: string;
  cnpj: string;
  esfera: "federal" | "estadual" | "municipal";
  usuarios_count: number;
  ordens_mes: number;
  active: boolean;
}

const ESFERA_LABEL: Record<OrgaoRow["esfera"], string> = {
  federal: "Federal",
  estadual: "Estadual",
  municipal: "Municipal",
};

function OrgaosPage() {
  const [search, setSearch] = useState("");
  const [esferaFilter, setEsferaFilter] = useState<string>("todas");
  const orgaos: OrgaoRow[] = [];

  return (
    <div>
      <PageHeader
        breadcrumb="Governança / Órgãos"
        title="Órgãos públicos"
        description="Gestão dos órgãos clientes (federal, estadual, municipal) e suas equipes."
        actions={
          <Button size="sm">
            <Plus className="size-4" /> Cadastrar órgão
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Órgãos ativos" value={0} icon={Building2} tone="primary" />
        <KPICard label="Federais" value={0} hint="Esfera federal" />
        <KPICard label="Estaduais" value={0} hint="Esfera estadual" />
        <KPICard label="Municipais" value={0} hint="Esfera municipal" />
      </div>

      <SectionCard title="Órgãos cadastrados">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou CNPJ..."
              className="pl-9"
            />
          </div>
          <Select value={esferaFilter} onValueChange={setEsferaFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Esfera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as esferas</SelectItem>
              <SelectItem value="federal">Federal</SelectItem>
              <SelectItem value="estadual">Estadual</SelectItem>
              <SelectItem value="municipal">Municipal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {orgaos.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Nenhum órgão cadastrado"
            description="Cadastre os órgãos públicos clientes. Cada órgão é um tenant lógico com seus próprios usuários, equipes e ordens."
            action={
              <Button size="sm">
                <Plus className="size-4" /> Cadastrar primeiro órgão
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[170px]">CNPJ</TableHead>
                  <TableHead className="w-[120px]">Esfera</TableHead>
                  <TableHead className="w-[110px] text-right">Usuários</TableHead>
                  <TableHead className="w-[140px] text-right">Ordens (mês)</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgaos.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.nome}</TableCell>
                    <TableCell className="font-mono text-xs">{o.cnpj}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-xs">
                        <MapPin className="size-3 text-muted-foreground" />
                        {ESFERA_LABEL[o.esfera]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Users className="size-3 text-muted-foreground" />
                        {o.usuarios_count}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{o.ordens_mes}</TableCell>
                    <TableCell>
                      <Badge variant={o.active ? "default" : "secondary"}>
                        {o.active ? "Ativo" : "Inativo"}
                      </Badge>
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

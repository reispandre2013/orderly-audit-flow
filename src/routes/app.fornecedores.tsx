import { createFileRoute } from "@tanstack/react-router";
import { Truck, Plus, Search, Building2, Phone, Mail } from "lucide-react";
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

export const Route = createFileRoute("/app/fornecedores")({
  head: () => ({ meta: [{ title: "Fornecedores — SisPão Público" }] }),
  component: FornecedoresPage,
});

interface FornecedorRow {
  id: string;
  razao_social: string;
  cnpj: string;
  email: string;
  telefone: string;
  produtos_count: number;
  ativo: boolean;
}

function FornecedoresPage() {
  const [search, setSearch] = useState("");
  const rows: FornecedorRow[] = [];

  return (
    <div>
      <PageHeader
        breadcrumb="Catálogo / Fornecedores"
        title="Fornecedores"
        description="Cadastro e gestão de fornecedores credenciados que atendem os órgãos públicos."
        actions={
          <Button size="sm">
            <Plus className="size-4" /> Credenciar fornecedor
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Credenciados" value={0} icon={Building2} tone="primary" />
        <KPICard label="Ativos" value={0} icon={Truck} tone="success" />
        <KPICard label="Produtos no catálogo" value={0} hint="Total entre fornecedores" />
        <KPICard label="Pendentes de validação" value={0} tone="warning" />
      </div>

      <SectionCard title="Fornecedores credenciados">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[280px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por razão social ou CNPJ..."
              className="pl-9"
            />
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={Truck}
            title="Nenhum fornecedor credenciado"
            description="Credencie fornecedores para que eles possam receber pedidos, gerenciar catálogo e produção."
            action={
              <Button size="sm">
                <Plus className="size-4" /> Credenciar primeiro fornecedor
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Razão social</TableHead>
                  <TableHead className="w-[160px]">CNPJ</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="w-[100px] text-right">Produtos</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.razao_social}</TableCell>
                    <TableCell className="font-mono text-xs">{f.cnpj}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="size-3" /> {f.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="size-3" /> {f.telefone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{f.produtos_count}</TableCell>
                    <TableCell>
                      <Badge variant={f.ativo ? "default" : "secondary"}>
                        {f.ativo ? "Ativo" : "Inativo"}
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

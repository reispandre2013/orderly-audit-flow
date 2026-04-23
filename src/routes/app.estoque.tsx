import { createFileRoute } from "@tanstack/react-router";
import { Boxes, AlertTriangle, TrendingDown, Package, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";
import { KPICard } from "@/components/kpi-card";
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

export const Route = createFileRoute("/app/estoque")({
  head: () => ({ meta: [{ title: "Estoque — SisPão Público" }] }),
  component: EstoquePage,
});

interface EstoqueRow {
  id: string;
  produto: string;
  lote: string;
  fornecedor: string;
  validade: string;
  quantidade: number;
  unidade: string;
  minimo: number;
}

function EstoquePage() {
  const [tab, setTab] = useState("posicoes");
  const [search, setSearch] = useState("");
  const rows: EstoqueRow[] = [];

  return (
    <div>
      <PageHeader
        breadcrumb="Catálogo / Estoque"
        title="Estoque"
        description="Posições de estoque por produto, lote e validade. Alertas de mínimo e vencimento."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="SKUs em estoque" value={0} icon={Package} tone="primary" />
        <KPICard label="Itens abaixo do mínimo" value={0} icon={TrendingDown} tone="warning" />
        <KPICard label="Lotes vencendo (30d)" value={0} icon={AlertTriangle} tone="warning" />
        <KPICard label="Lotes vencidos" value={0} tone="default" />
      </div>

      <SectionCard
        title="Posições de estoque"
        actions={
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="posicoes">Posições</TabsTrigger>
              <TabsTrigger value="movimentos">Movimentos</TabsTrigger>
              <TabsTrigger value="alertas">Alertas</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[280px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto, lote ou fornecedor..."
              className="pl-9"
            />
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title="Sem posições de estoque"
            description="Quando os fornecedores registrarem produção e entradas, as posições por lote aparecerão aqui."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="w-[120px]">Lote</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="w-[120px]">Validade</TableHead>
                  <TableHead className="w-[120px] text-right">Quantidade</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.produto}</TableCell>
                    <TableCell className="font-mono text-xs">{r.lote}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.fornecedor}</TableCell>
                    <TableCell className="text-xs">{r.validade}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {r.quantidade} <span className="text-xs text-muted-foreground">{r.unidade}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.quantidade < r.minimo ? "destructive" : "default"}>
                        {r.quantidade < r.minimo ? "Baixo" : "OK"}
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

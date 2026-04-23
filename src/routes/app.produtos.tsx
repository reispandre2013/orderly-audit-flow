import { createFileRoute } from "@tanstack/react-router";
import { Package, Plus, Search, Filter, Download } from "lucide-react";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";
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
import { formatBRL } from "@/lib/format";

export const Route = createFileRoute("/app/produtos")({
  head: () => ({ meta: [{ title: "Produtos — SisPão Público" }] }),
  component: ProdutosPage,
});

interface ProdutoRow {
  id: string;
  codigo: string;
  nome: string;
  fornecedor: string;
  unidade: string;
  preco_centavos: number;
  ativo: boolean;
}

function ProdutosPage() {
  // Lista vazia — quando o backend Supabase for plugado, substituir por useQuery.
  const [search, setSearch] = useState("");
  const [fornecedor, setFornecedor] = useState<string>("todos");
  const [status, setStatus] = useState<string>("todos");

  const rows: ProdutoRow[] = useMemo(() => [], []);
  const filtered = rows;

  return (
    <div>
      <PageHeader
        breadcrumb="Catálogo / Produtos"
        title="Produtos"
        description="Catálogo de produtos por fornecedor com preços, unidades e status."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Exportar CSV
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> Novo produto
            </Button>
          </>
        }
      />

      <SectionCard
        title="Catálogo"
        description={`${filtered.length} produto(s) encontrado(s)`}
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código ou nome..."
              className="pl-9"
            />
          </div>
          <Select value={fornecedor} onValueChange={setFornecedor}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Fornecedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os fornecedores</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="inativo">Inativos</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="size-4" /> Mais filtros
          </Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Nenhum produto cadastrado"
            description="Cadastre produtos para os fornecedores credenciados. Eles aparecerão aqui com código, unidade e preço unitário."
            action={
              <Button size="sm">
                <Plus className="size-4" /> Cadastrar primeiro produto
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="w-[80px]">Unid.</TableHead>
                  <TableHead className="w-[140px] text-right">Preço unit.</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.codigo}</TableCell>
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.fornecedor}</TableCell>
                    <TableCell className="text-xs uppercase">{p.unidade}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatBRL(p.preco_centavos)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.ativo ? "default" : "secondary"}>
                        {p.ativo ? "Ativo" : "Inativo"}
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

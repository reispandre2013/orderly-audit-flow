import { createFileRoute } from "@tanstack/react-router";
import {
  Wallet,
  Receipt,
  TrendingUp,
  Clock,
  CheckCircle2,
  Search,
  Download,
  FileText,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBRL } from "@/lib/format";

export const Route = createFileRoute("/app/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro — SisPão Público" }] }),
  component: FinanceiroPage,
});

interface FaturaRow {
  id: string;
  numero: string;
  ordem: string;
  fornecedor: string;
  emissao: string;
  vencimento: string;
  total_centavos: number;
  status: "pendente" | "empenhada" | "paga" | "atrasada";
}

const STATUS_LABEL: Record<FaturaRow["status"], { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pendente: { label: "Pendente", variant: "secondary" },
  empenhada: { label: "Empenhada", variant: "outline" },
  paga: { label: "Paga", variant: "default" },
  atrasada: { label: "Atrasada", variant: "destructive" },
};

function FinanceiroPage() {
  const [tab, setTab] = useState("faturas");
  const [search, setSearch] = useState("");
  const [periodo, setPeriodo] = useState("30d");

  const faturas: FaturaRow[] = [];

  return (
    <div>
      <PageHeader
        breadcrumb="Administrativo / Financeiro"
        title="Financeiro"
        description="Empenhos, faturas, pagamentos e conciliação por fornecedor e órgão."
        actions={
          <>
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="ano">Este ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Exportar
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="A pagar" value={formatBRL(0)} icon={Clock} tone="warning" hint="Faturas em aberto" />
        <KPICard label="Pago no período" value={formatBRL(0)} icon={CheckCircle2} tone="success" />
        <KPICard label="Empenhado" value={formatBRL(0)} icon={Receipt} tone="primary" />
        <KPICard label="Ticket médio" value={formatBRL(0)} icon={TrendingUp} hint="Por ordem" />
      </div>

      <SectionCard
        title="Movimentações financeiras"
        actions={
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="faturas">Faturas</TabsTrigger>
              <TabsTrigger value="empenhos">Empenhos</TabsTrigger>
              <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
              <TabsTrigger value="conciliacao">Conciliação</TabsTrigger>
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
              placeholder="Buscar por número, ordem ou fornecedor..."
              className="pl-9"
            />
          </div>
        </div>

        {faturas.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="Sem movimentações financeiras"
            description="Quando ordens forem entregues e faturadas, as movimentações financeiras aparecerão aqui para empenho, pagamento e conciliação."
            action={
              <Button variant="outline" size="sm">
                <FileText className="size-4" /> Importar nota fiscal
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Nº Fatura</TableHead>
                  <TableHead className="w-[140px]">Ordem</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="w-[110px]">Emissão</TableHead>
                  <TableHead className="w-[110px]">Vencimento</TableHead>
                  <TableHead className="w-[140px] text-right">Total</TableHead>
                  <TableHead className="w-[110px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faturas.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-mono text-xs">{f.numero}</TableCell>
                    <TableCell className="font-mono text-xs">{f.ordem}</TableCell>
                    <TableCell className="font-medium">{f.fornecedor}</TableCell>
                    <TableCell className="text-xs">{f.emissao}</TableCell>
                    <TableCell className="text-xs">{f.vencimento}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatBRL(f.total_centavos)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_LABEL[f.status].variant}>
                        {STATUS_LABEL[f.status].label}
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

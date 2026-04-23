import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Download,
  TrendingUp,
  ShoppingCart,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { KPICard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBRL } from "@/lib/format";

export const Route = createFileRoute("/app/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — SisPão Público" }] }),
  component: RelatoriosPage,
});

const PIE_COLORS = [
  "hsl(var(--chart-1, 220 70% 50%))",
  "hsl(var(--chart-2, 160 60% 45%))",
  "hsl(var(--chart-3, 30 80% 55%))",
  "hsl(var(--chart-4, 280 65% 60%))",
];

function RelatoriosPage() {
  const [periodo, setPeriodo] = useState("30d");
  const [tab, setTab] = useState("operacional");

  // Séries vazias — quando o backend Supabase for plugado, substituir por useQuery.
  const serieOrdens = useMemo(() => [] as Array<{ dia: string; total: number }>, []);
  const serieValor = useMemo(() => [] as Array<{ dia: string; valor: number }>, []);
  const porFornecedor = useMemo(() => [] as Array<{ fornecedor: string; valor: number }>, []);
  const porStatus = useMemo(() => [] as Array<{ name: string; value: number }>, []);

  return (
    <div>
      <PageHeader
        breadcrumb="Administrativo / Relatórios"
        title="Relatórios"
        description="Análises operacionais, financeiras e de SLA por período, órgão e fornecedor."
        actions={
          <>
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[160px]">
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
              <Download className="size-4" /> Exportar PDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Exportar CSV
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Ordens emitidas"
          value={0}
          icon={ShoppingCart}
          tone="primary"
          trend={{ value: "0%", positive: true }}
        />
        <KPICard
          label="Valor empenhado"
          value={formatBRL(0)}
          icon={TrendingUp}
          tone="success"
        />
        <KPICard
          label="Tempo médio aprovação"
          value="—"
          icon={Clock}
          hint="Da emissão à assinatura"
        />
        <KPICard
          label="Taxa de entrega no prazo"
          value="—"
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="operacional">Operacional</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="sla">SLA & Qualidade</TabsTrigger>
          <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Ordens por dia" description="Volume de ordens emitidas no período">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={serieOrdens} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-ordens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#grad-ordens)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Valor empenhado" description="Empenho diário no período">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={serieValor} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-valor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  fill="url(#grad-valor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Top fornecedores" description="Volume por fornecedor">
          <div className="h-[280px]">
            {porFornecedor.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <BarChart3 className="size-8 opacity-40" />
                  <span>Sem dados no período</span>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={porFornecedor} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis dataKey="fornecedor" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={120} />
                  <Tooltip />
                  <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Distribuição por status" description="Ordens por status atual">
          <div className="h-[280px]">
            {porStatus.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <BarChart3 className="size-8 opacity-40" />
                  <span>Sem dados no período</span>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={porStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                  >
                    {porStatus.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

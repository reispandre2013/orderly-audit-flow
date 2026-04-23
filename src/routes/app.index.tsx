import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, CheckSquare, Truck, Plus, Activity } from "lucide-react";
import { KPICard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth/auth-context";
import { ROLE_LABEL } from "@/lib/domain/roles";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — SisPão Público" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, activeRole } = useAuth();
  const greeting = user?.full_name ? user.full_name.split(" ")[0] : "Operador";

  return (
    <div>
      <PageHeader
        breadcrumb="Visão geral / Dashboard"
        title={`Olá, ${greeting}`}
        description={
          activeRole
            ? `Visão consolidada do perfil ${ROLE_LABEL[activeRole]}.`
            : "Visão consolidada da operação."
        }
        actions={
          <Link
            to="/app/ordens/nova"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-card transition-shadow hover:shadow-elevated"
          >
            <Plus className="size-4" /> Nova ordem
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Pedidos pendentes" value="—" icon={ClipboardList} hint="Aguardando dados" />
        <KPICard label="Em aprovação" value="—" icon={CheckSquare} tone="primary" hint="Aguardando dados" />
        <KPICard label="Em produção" value="—" icon={Truck} tone="accent" hint="Aguardando dados" />
        <KPICard label="Valor do mês" value="R$ —" icon={Activity} tone="success" hint="Aguardando dados" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard title="Pedidos recentes" description="Últimas ordens de compra" className="lg:col-span-2">
          <EmptyState
            icon={ClipboardList}
            title="Sem pedidos para exibir"
            description="Quando o backend estiver conectado, suas ordens aparecerão aqui automaticamente."
            action={
              <Link
                to="/app/ordens/nova"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground"
              >
                <Plus className="size-4" /> Criar primeira ordem
              </Link>
            }
          />
        </SectionCard>

        <SectionCard title="Atividade" description="Últimos eventos do sistema">
          <EmptyState
            icon={Activity}
            title="Sem atividade recente"
            description="Cada ação crítica gera um registro auditável."
          />
        </SectionCard>
      </div>
    </div>
  );
}

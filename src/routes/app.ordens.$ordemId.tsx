import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ClipboardList,
  CheckSquare,
  XSquare,
  Send,
  Truck,
  PackageCheck,
  FileText,
  ShieldCheck,
  Activity,
  Paperclip,
  MessageSquare,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/lib/auth/auth-context";
import { APPROVAL_ROLES, FORNECEDOR_ROLES, type AppRole } from "@/lib/domain/roles";

export const Route = createFileRoute("/app/ordens/$ordemId")({
  head: ({ params }) => ({
    meta: [{ title: `Ordem ${params.ordemId} — SisPão Público` }],
  }),
  component: OrdemDetailPage,
});

function OrdemDetailPage() {
  const { ordemId } = Route.useParams();
  const { activeRole } = useAuth();

  return (
    <div>
      <PageHeader
        breadcrumb={
          <>
            <Link to="/app/ordens" className="hover:text-foreground">
              Operação / Ordens
            </Link>{" "}
            / Detalhe
          </>
        }
        title={`Ordem ${ordemId}`}
        description="Visão consolidada com itens, timeline auditável, anexos e ações disponíveis para o seu perfil."
        actions={
          <Link
            to="/app/ordens"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary"
          >
            <ArrowLeft className="size-4" /> Voltar
          </Link>
        }
      />

      {/* Resumo */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">Ordem #{ordemId}</h2>
              <StatusBadge status="pending_approval" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Os dados desta ordem aparecerão aqui assim que o backend estiver conectado.
            </p>
          </div>
          <RoleActions role={activeRole} />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm sm:grid-cols-4">
          <Meta label="Solicitante" value="—" />
          <Meta label="Coordenador" value="—" />
          <Meta label="Fornecedor" value="—" />
          <Meta label="Órgão" value="—" />
          <Meta label="Departamento" value="—" />
          <Meta label="Equipe" value="—" />
          <Meta label="Data entrega" value="—" />
          <Meta label="Total" value="R$ —" />
        </dl>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard title="Itens da ordem" className="lg:col-span-2">
          <EmptyState
            icon={ClipboardList}
            title="Itens aparecerão aqui"
            description="Lista de produtos, unidades, quantidades e subtotais — espelhando o snapshot capturado no momento da criação."
          />
        </SectionCard>

        <SectionCard title="Timeline" description="Eventos auditáveis">
          <EmptyState
            icon={Activity}
            title="Sem eventos"
            description="Cada transição de status, comentário, aprovação e upload aparecerá aqui com ator, data, IP e dispositivo."
          />
        </SectionCard>

        <SectionCard title="Anexos & comprovantes" className="lg:col-span-2">
          <EmptyState
            icon={Paperclip}
            title="Nenhum anexo"
            description="Notas fiscais, fotos do recebimento, comprovantes e dossiês ficam armazenados em Storage com acesso por RLS."
          />
        </SectionCard>

        <SectionCard
          title="Auditoria"
          description="Metadados capturados"
          actions={<ShieldCheck className="size-4 text-primary" />}
        >
          <ul className="space-y-2 text-sm">
            <AuditRow k="IP" v="—" />
            <AuditRow k="Sistema" v="—" />
            <AuditRow k="Navegador" v="—" />
            <AuditRow k="Dispositivo" v="—" />
            <AuditRow k="CPF do ator" v="—" />
            <AuditRow k="Matrícula" v="—" />
          </ul>
          <Link
            to="/app/auditoria"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <FileText className="size-3.5" /> Abrir trilha completa
          </Link>
        </SectionCard>

        <SectionCard title="Comentários" className="lg:col-span-3">
          <EmptyState
            icon={MessageSquare}
            title="Sem comentários"
            description="Solicitante, coordenador e fornecedor podem trocar mensagens contextualizadas — tudo registrado na auditoria."
          />
        </SectionCard>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function AuditRow({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5 text-xs last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-mono text-[11px] text-foreground">{v}</span>
    </li>
  );
}

function RoleActions({ role }: { role: AppRole | null }) {
  if (!role) return null;
  const isApprover = APPROVAL_ROLES.includes(role);
  const isSupplier = FORNECEDOR_ROLES.includes(role);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isApprover && (
        <>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-status-approved px-3 py-2 text-sm font-semibold text-status-approved-foreground"
          >
            <CheckSquare className="size-4" /> Aprovar
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-destructive bg-background px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
          >
            <XSquare className="size-4" /> Rejeitar
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary"
          >
            <Send className="size-4" /> Enviar ao fornecedor
          </button>
        </>
      )}
      {isSupplier && (
        <>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-status-production px-3 py-2 text-sm font-semibold text-status-production-foreground"
          >
            <Truck className="size-4" /> Iniciar produção
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-status-delivered px-3 py-2 text-sm font-semibold text-status-delivered-foreground"
          >
            <PackageCheck className="size-4" /> Marcar entregue
          </button>
        </>
      )}
    </div>
  );
}
